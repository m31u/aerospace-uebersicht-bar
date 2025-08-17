import { styled, run, css, React } from "uebersicht"

const { useMemo, useEffect, useState } = React

function connectToServer(dispatch) {
	const ws = new WebSocket("ws://localhost:3000/listen")

	ws.addEventListener("error", () => {
		dispatch({ type: "CONNECTING_TO_SERVER" })
		setTimeout(() => connectToServer(dispatch), 5000)
	})

	ws.addEventListener("open", () => {
		dispatch({ type: "CONNECTED_TO_SERVER" })
	})

	ws.addEventListener("message", message => {
		dispatch(JSON.parse(message.data))
	})
}

export const init = connectToServer

export const initialState = {
	connected: false,
	battery: {
		percentage: 0,
		source: "Unknown",
		charging: false,
	},
	workspaces: [],
	windows: []
}

export function updateState(event, state) {
	switch (event.type) {
		case "CONNECTING_TO_SERVER": {
			return {
				...state,
				connected: false
			}
		}
		case "CONNECTED_TO_SERVER": {
			return {
				...state,
				connected: true
			}
		}
		case "UPDATE_BATTERY": {
			return {
				...state,
				battery: event.data,
			}
		}
		case "UPDATE_WORKSPACES": {
			return {
				...state,
				workspaces: event.data
			}
		}
		case "UPDATE_WINDOWS": {
			return {
				...state,
				windows: event.data
			}
		}
		default:
			return state
	}
}

export const refreshFrequency = false

const colors = {
	Rosewater: "#f2d5cf",
	Flamingo: "#eebebe",
	Pink: "#f4b8e4",
	Mauve: "#ca9ee6",
	Red: "#e78284",
	Maroon: "#ea999c",
	Peach: "#ef9f76",
	Yellow: "#e5c890",
	Green: "#a6d189",
	Teal: "#81c8be",
	Sky: "#99d1db",
	Sapphire: "#85c1dc",
	Blue: "#8caaee",
	Lavender: "#babbf1",
	Text: "#c6d0f5",
	Subtext1: "#b5bfe2",
	Subtext0: "#a5adce",
	Overlay2: "#949cbb",
	Overlay1: "#838ba7",
	Overlay0: "#737994",
	Surface2: "#626880",
	Surface1: "#51576d",
	Surface0: "#414559",
	Base: "#303446",
	Mantle: "#292c3c",
	Crust: "#232634"
}

/*
 * UI COMPONENTS
 */
export const className = {
	top: 0,
	left: 0,
	padding: 0,
	margin: 0,
	width: "100%",
}

const InfoContainer = styled("div")({
	display: "flex",
	position: "relative",
	flexDirection: "row",
	margin: 0,
	padding: 0,
	whiteSpace: "pre",
	alignItems: "center",
	userSelect: "none",
	gap: "4px",
})

/*
 * Workspaces Component
 */
const Space = styled("div")(({ focused }) => {
	const color = focused ? colors.Text : colors.Subtext0

	return {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		color: colors.Base,
		border: `1px solid ${color}`,
		borderRadius: "16px",
		width: "16px",
		height: "16px",
		background: color,
	}
})

function Workspaces({ workspaces }) {
	return (
		<InfoContainer width="45%" justify="flex-start">
			{workspaces.map(({ empty, focused, workspace }) => {
				if (empty && !focused) {
					return
				}
				return <Space key={workspace} focused={focused}>
					{workspace}
				</Space>
			}
			)}
		</InfoContainer>
	)
}

/*
 * Window Component
 */
const windowIcons = {
	"GHOSTTY": "\ue795",
	"ZEN": "\udb83\udf94",
	"FINDER": "\udb80\udc36",
	"KARABINER-ELEMENTS": "\udb85\udcc0",
	"SYSTEM SETTINGS": "\uef70",
	"SPOTIFY": "\udb81\udcc7",
	"default": "\udb81\ude14"
}

function getWindowIcon(app) {
	return windowIcons[app.toUpperCase()] || windowIcons["default"]
}

const WindowTab = styled("div")(({ focused }) => {
	const color = focused ? colors.Text : colors.Subtext0

	return {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		color: colors.Base,
		border: `1px solid ${color}`,
		borderRadius: "16px",
		height: "16px",
		padding: "0 6px",
		background: color,
		gap: "2px",
	}
})


const Windows = ({ windows }) => {
	return (
		<InfoContainer>
			{windows.map(window => {
				return <WindowTab key={window.id} focused={window.focused}>
					<span className={css({ marginRight: "4px" })}>{getWindowIcon(window.app)}</span>
					<span>{window.app}</span>
				</WindowTab>
			})}
		</InfoContainer>
	)
}

/*
 * Clock Components
 */
const ClockContainer = styled("div")(({ color }) => ({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	color: colors.Base,
	border: `1px solid ${color}`,
	background: color,
	padding: "0 6px",
	height: "16px",
	borderRadius: "16px",
}))

const clockIcons = [
	"\udb85\udc4a",
	"\udb85\udc3f",
	"\udb85\udc40",
	"\udb85\udc41",
	"\udb85\udc42",
	"\udb85\udc43",
	"\udb85\udc44",
	"\udb85\udc45",
	"\udb85\udc46",
	"\udb85\udc47",
	"\udb85\udc48",
	"\udb85\udc49"
]

function Clock() {
	const [time, setTime] = useState({
		currentDate: "31/12/99",
		currentTime: "00:00:00"
	})

	useEffect(() => {
		const tick = setInterval(() => {
			run(`date +'{ "currentDate": "%d/%m/%y", "currentTime": "%H:%M:%S" }'`).then(
				output => setTime(JSON.parse(output))
			)
		}, 1000)

		return () => clearInterval(tick)
	}, [])

	const clock = clockIcons[time.currentTime.slice(0, 2) % 12]

	return (
		<InfoContainer>
			<ClockContainer color={colors.Sapphire}>
				<span className={css({ marginRight: "6px" })}>{"\udb83\ude17"}</span>
				{time.currentDate}
			</ClockContainer>
			<ClockContainer color={colors.Blue}>
				<span className={css({ marginRight: "6px" })}>{clock}</span>
				{time.currentTime}
			</ClockContainer>
		</InfoContainer>
	)
}

/*
 * Battery Component
 */
const BatteryContainer = styled("div")(({ color }) => ({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	fontSize: "12px",
	border: `1px solid ${color}`,
	borderRadius: "16px",
	height: "16px",
	lineHeight: 1,
	background: color,
	color: colors.Base,
	padding: "0 6px",
}))

function Battery({ battery }) {
	const { percentage, source, charging } = battery

	const color = useMemo(() => {
		if (percentage == 100 && source == "AC") {
			return colors.Green
		}
		if (charging) {
			return colors.Teal
		}
		if (source == "AC") {
			return colors.Yellow
		}
		if (percentage > 25) {
			return colors.Sky
		}
		if (percentage > 15) {
			return colors.Peach
		}

		return colors.Red
	}, [percentage, source, charging])

	let icon = useMemo(() => {
		if (charging) {
			return "\udb80\udc84"
		}

		if (!charging && source == "AC") {
			return "\udb81\udea5"
		}

		if (percentage > 95) {
			return "\udb80\udc79"
		}

		if (percentage > 85) {
			return "\udb80\udc82"
		}

		if (percentage > 75) {
			return "\udb80\udc81"
		}

		if (percentage > 65) {
			return "\udb80\udc80"
		}

		if (percentage > 55) {
			return "\udb80\udc7f"
		}

		if (percentage > 45) {
			return "\udb80\udc7e"
		}

		if (percentage > 35) {
			return "\udb80\udc7d"
		}

		if (percentage > 25) {
			return "\udb80\udc7c"
		}

		if (percentage > 15) {
			return "\udb80\udc7b"
		}

		if (percentage > 5) {
			return "\udb80\udc7a"
		}

		return "\udb80\udc8e"
	}, [percentage, charging, source])


	return (
		<InfoContainer>
			<BatteryContainer color={color}>
				<span className={css({ paddingRight: "2px" })}>{icon}</span>
				{percentage}%
			</BatteryContainer>
		</InfoContainer>
	)
}

/*
 * Root Component
 */
const LeftContainer = styled('div')({
	display: "flex",
	justifyContent: "flex-start",
	alignItems: "center",
	flexGrow: 1,
	gap: "4px"
})

const RightContainer = styled('div')({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	gap: "4px"
})

const MessageContainer = styled("div")({
	display: "flex",
	flexGrow: 1,
	justifyContent: "center",
	alignItems: "center",
})

const Message = styled("div")({
	display: "flex",
	height: "16px",
	borderRadius: "16px",
	border: `1px solid ${colors.Yellow}`,
	background: colors.Yellow,
	justifyContent: "center",
	color: colors.Base,
	alignItems: "center",
	padding: "0 6px"
})

const Container = styled("div")(() => ({
	display: "flex",
	margin: "10px",
	fontFamily: "Iosevka Nerd Font",
	fontWeight: "normal",
	fontVariant: "normal",
	lineHeight: 1,
	textTransform: "none",
	fontSize: "12px",
	height: "16px",
	flexGrow: 1,
	justifyContent: "space-between",
	userSelect: "none",
	cursor: "default"
}))

function Widget({ connected, battery, workspaces, windows }) {

	if (!connected) {
		return (
			<Container>
				<MessageContainer>
					<Message>Connecting to server...</Message>
				</MessageContainer>
			</Container>
		)
	}

	return (
		<Container >
			<LeftContainer>
				<Workspaces workspaces={workspaces} />
				<Windows windows={windows} />
			</LeftContainer>
			<RightContainer>
				<Battery battery={battery} />
				<Clock />
			</RightContainer>
		</Container>
	)

}

export function render(state) {
	return <Widget connected={state.connected} battery={state.battery} workspaces={state.workspaces} windows={state.windows} />
}
