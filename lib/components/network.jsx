import { styled } from "uebersicht"
import { InfoContainer } from "./common.jsx";
import { colors } from "../util";

const NetworkContainer = styled("div")(({ color }) => ({
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

const Icon = styled("span")({
	paddingRight: "8px"
})

function Network({ network }) {
	let ssid = network.ssid
	let color = colors.Green
	if (!ssid) {
		ssid = "Not Connected"
		color = colors.Text
	}


	return <InfoContainer>
		<NetworkContainer color={color}><Icon>{"\uf1eb"}</Icon>{ssid}</NetworkContainer>
	</InfoContainer>
}

export { Network }
