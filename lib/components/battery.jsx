import { styled, css, React } from "uebersicht"
import { InfoContainer } from "./common.jsx"
import { colors } from "../util.js"
const { useMemo } = React

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
	color: colors.BackgroundDim,
	padding: "0 6px",
}))

function Battery({ battery }) {
	const { percentage, source, charging } = battery

	const color = useMemo(() => {
		if (percentage == 100 && source == "AC") {
			return colors.Green
		}
		if (charging) {
			return colors.Aqua
		}
		if (source == "AC") {
			return colors.Yellow
		}
		if (percentage > 25) {
			return colors.Blue
		}
		if (percentage > 15) {
			return colors.Orange
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

export { Battery }
