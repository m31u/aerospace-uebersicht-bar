

export const StateEvents = {
	Connecting: "CONNECTING_TO_SERVER",
	Connected: "CONNECTED_TO_SERVER",
	Battery: "UPDATE_BATTERY",
	Workspaces: "UPDATE_WORKSPACES",
	SSIDChange: "NETWORK_UPDATE_SSID_CHANGE",
	WifiConnected: "NETWORK_UPDATE_WIFI_CONNECT",
	WifiDisconneted: "NETWORK_UPDATE_WIFI_DISCONNECT",
	ShowSSID: "NETWORK_SHOW_SSID",
}

export function connectToServer(dispatch) {
	const ws = new WebSocket("ws://localhost:3000/client?name=bar")

	ws.addEventListener("error", () => {
		dispatch(StateEvents.Connecting)
		setTimeout(() => connectToServer(dispatch), 5000)
	})

	ws.addEventListener("open", () => {
		dispatch(StateEvents.Connected)
	})

	ws.addEventListener("message", message => {
		dispatch(JSON.parse(message.data))
	})
}

export function initServer(dispatchRaw) {
	function dispatch(event) {
		if (typeof event == "string") {
			dispatchRaw({ type: event })
			return
		}
		dispatchRaw(event)
	}

	connectToServer(dispatch)
}
