import { styled, css, React } from "uebersicht"
import { InfoContainer } from "./common.jsx"
import { colors } from "../util.js"

const { useEffect, useState } = React

const playerIcons = {
	"ZEN": "\uee47",
	"SPOTIFY": "\uf1bc",
	"default": "\udb81\ude14"
}
const NowPlayingContainer = styled("div")(({ color }) => ({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	color: colors.Base,
	border: `1px solid ${color}`,
	background: color,
	padding: "0 6px",
	height: "16px",
	borderRadius: "16px",
	gap: "2px"
}))


const MarqueeContainer = styled("div")(({ width }) => {
	return {
		width: `${width}px`,
		height: "16px",
		overflow: "hidden",
		position: "relative"
	}
})

function MarqueeText({ children }) {

	const className = css`
  		position: absolute;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		animation: ${children.length < MAX_TITLE_LENGTH * 2 ? "marquee 10s" : "marqueeLong 20s"} linear infinite;
		height: 16px;
		gap: 6px;
		@keyframes marquee {
			0%, 50% { transform: translate(0%)}
			100% { transform: translate(calc(-50% - 3px)) }
		}
		@keyframes marqueeLong {
			0%, 25% { transform: translate(0%)}
			100% { transform: translate(calc(-50% - 3px)) }
		}
`

	return <div className={className} >
		<span className={css` float: left;`}>{children}</span>
		<span className={css` float: left;`}>{children}</span>
	</div>
}

function Marquee({ children }) {


	return <MarqueeContainer width={150}>
		<MarqueeText>
			{children}
		</MarqueeText>
	</MarqueeContainer>
}

function TitleWrapper({ title, isPlaying }) {
	if (title.length > MAX_TITLE_LENGTH && isPlaying) {

		return <Marquee>{title}</Marquee>
	}

	return <p>{title.slice(0, MAX_TITLE_LENGTH)}</p>
}

const MAX_TITLE_LENGTH = 25

function PlayerIcon({ player }) {

	const icon = playerIcons[player.toUpperCase()] || playerIcons["default"]


	return <span className={css`padding-right: 6px;`}>{icon}</span>
}

function NowPlaying({ nowPlaying }) {
	const { artist, title, isPlaying } = nowPlaying

	const [show, setShow] = useState(false)

	useEffect(() => {
		if (!isPlaying && show) {
			const t = setTimeout(() => {
				setShow(false)
			}, 120000)

			return () => clearTimeout(t)
		}
		setShow(isPlaying)
	}, [isPlaying])

	const color = ((playing) => {
		if (playing) {
			return colors.Sapphire
		}

		return colors.Text
	})(nowPlaying.isPlaying)

	if (!show) {
		return null
	}

	return <InfoContainer>
		<NowPlayingContainer color={color}>
			<PlayerIcon player={nowPlaying.player} />
			<p>{artist}</p>
			{"|"}
			<TitleWrapper title={title} isPlaying={isPlaying} />
		</NowPlayingContainer>
	</InfoContainer>
}

export { NowPlaying }
