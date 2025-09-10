import { styled, React } from "uebersicht"
import { InfoContainer } from "./common.jsx"
import { colors } from "../util.js"

const Space = styled("div")(({ focused, empty }) => {
	const color = focused ? colors.Text : colors.Subtext0
	const padding = empty ? 0 : "6px"
	return {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		color: colors.Base,
		border: `1px solid ${color}`,
		borderRadius: "16px",
		height: "16px",
		background: color,
		padding: `0 ${padding}`,
		minWidth: "16px",
		boxSizing: "border-box",
		"span.icon": {
			color: colors.Overlay0,
			padding: "0 6px"
		},
		"span.focused": {
			color: colors.Base
		}
	}
})

const windowIcons = {
	"GHOSTTY": "\uf489",
	"ZEN": "\uee47",
	"FINDER": "\udb80\udc36",
	"KARABINER-ELEMENTS": "\udb85\udcc0",
	"SYSTEM SETTINGS": "\uef70",
	"SPOTIFY": "\uf1bc",
	"default": "\udb81\ude14"
}

function getWindowIcon(app) {
	return windowIcons[app.toUpperCase()] || windowIcons["default"]
}


function Workspace({ workspace, windows, focused }) {
	const empty = !windows.length

	if (empty && !focused) {
		return null
	}
	return <Space key={workspace} empty={empty} focused={focused}>
		<span>{workspace}</span>
		{windows.map(w => <span key={w.id} className={`icon ${w.focused ? "focused" : ""}`}>{getWindowIcon(w.app)}</span>)}
	</Space>

}

function Workspaces({ workspaces }) {
	return (
		<InfoContainer width="45%" justify="flex-start">
			{workspaces.map(({ focused, workspace, windows }) => (
				<Workspace
					key={workspace}
					workspace={workspace}
					windows={windows}
					focused={focused}
				/>
			))}
		</InfoContainer>
	)
}

export { Workspaces }
