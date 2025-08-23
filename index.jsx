import { styled, React } from "uebersicht"
import { Workspaces } from "./lib/components/workspaces.jsx"
import { Battery } from "./lib/components/battery.jsx"
import { Clock } from "./lib/components/clock.jsx"
import { colors } from "./lib/util.js"
import { StateEvents, connectToServer } from "./lib/server.js"

const init = connectToServer

const initialState = {
	connected: false,
	battery: {
		percentage: 0,
		source: "Unknown",
		charging: false,
	},
	workspaces: [],
}

function updateState(event, state) {
	switch (event.type) {
		case StateEvents.Connecting: {
			return {
				...state,
				connected: false
			}
		}
		case StateEvents.Connected: {
			return {
				...state,
				connected: true,
			}
		}
		case StateEvents.Battery: {
			return {
				...state,
				battery: event.data,
			}
		}
		case StateEvents.Workspaces: {
			return {
				...state,
				workspaces: event.data
			}
		}
		default:
			return state
	}
}


const className = {
	top: 0,
	left: 0,
	padding: 0,
	margin: 0,
	width: "100%",
}

function Widget({ connected, battery, workspaces }) {

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
			</LeftContainer>
			<RightContainer>
				<Battery battery={battery} />
				<Clock />
			</RightContainer>
		</Container>
	)
}

function render(state) {
	return <Widget connected={state.connected} battery={state.battery} workspaces={state.workspaces} />
}

export { className, initialState, init, updateState, render }

// Styles

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

const Container = styled("div")({
	display: "flex",
	margin: "8px",
	padding: "0 2px",
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
})


