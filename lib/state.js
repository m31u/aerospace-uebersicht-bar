import { StateEvents } from './server.js'

const initialState = {
	connected: false,
	battery: {
		percentage: 0,
		source: "Unknown",
		charging: false,
	},
	workspaces: [],
	network: {
		ssid: "",
		connected: false,
		showSSID: false
	},
	nowPlaying: {
		isPlaying: false,
		artist: "",
		title: "",
		player: ""
	}
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
				connected: true
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
		case StateEvents.SSIDChange: {
			return {
				...state,
				network: {
					ssid: event.data.ssid,
					connected: true
				}
			}
		}
		case StateEvents.Connected: {
			return {
				...state,
				network: {
					...state.network,
					connected: true
				}
			}
		}
		case StateEvents.WifiDisconneted: {
			return {
				...state,
				network: {
					ssid: "",
					connected: false
				}
			}
		}
		case StateEvents.ShowSSID: {
			return {
				...state,
				network: {
					...state.network,
					showSSID: !state.network.showSSID
				}
			}
		}
		case StateEvents.NowPlaying: {
			return {
				...state,
				nowPlaying: {
					...state.nowPlaying,
					...event.data
				}
			}
		}
		case StateEvents.IsPlaying: {
			return {
				...state,
				nowPlaying: {
					...state.nowPlaying,
					isPlaying: event.data
				}
			}
		}
		case StateEvents.CurrentPlayer: {
			return {
				...state,
				nowPlaying: {
					...state.nowPlaying,
					player: event.data
				}

			}
		}
		default:
			return state
	}
}

export { updateState, initialState }

