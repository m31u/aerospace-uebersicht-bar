

export const StateEvents = {
	Connecting: "CONNECTING_TO_SERVER",
	Connected: "CONNECTED_TO_SERVER",
	Battery: "UPDATE_BATTERY",
	Workspaces: "UPDATE_WORKSPACES"
}

export function connectToServer(dispatch) {
	const ws = new WebSocket("ws://localhost:3000/listen")

	ws.addEventListener("error", () => {
		dispatch({ type: StateEvents.Connecting })
		setTimeout(() => connectToServer(dispatch), 5000)
	})

	ws.addEventListener("open", () => {
		dispatch({ type: StateEvents.Connected })
	})

	ws.addEventListener("message", message => {
		dispatch(JSON.parse(message.data))
	})
}
