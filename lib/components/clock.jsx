
import { styled, css, run, React } from "uebersicht"
import { InfoContainer } from "./common.jsx"
import { colors } from "../util.js"

const { useEffect, useState } = React

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
		currentDate: "Sat 31/12/99",
		currentTime: "00:00"
	})

	useEffect(() => {
		const tick = setInterval(() => {
			run(`date +'{ "currentDate": "%a %d/%m/%y", "currentTime": "%H:%M" }'`).then(
				output => setTime(JSON.parse(output))
			)
		}, 5000)

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

export { Clock }
