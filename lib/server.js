

const StateEvents = {
	Connecting: "CONNECTING_TO_SERVER",
	Connected: "CONNECTED_TO_SERVER",
	ServerError: "SERVER_ERROR",
	Battery: "UPDATE_BATTERY",
	Workspaces: "UPDATE_WORKSPACES"
}

function healthCheck(dispatch) {
	function reCheck() {
		setTimeout(healthCheck, 2000, dispatch)
	}


	fetch("http://localhost:3000/heartbeat")
		.then(res => {
			return res.text()
		})
		.then(text => {
			console.log(text)
			if (text === "alive") {
				dispatch(StateEvents.Connecting)
				connectToServer(dispatch)
				return
			}
			dispatch(StateEvents.ServerError)
			reCheck()
		})
		.catch(() => {
			dispatch(StateEvents.ServerError)
			reCheck()
		})
}

function connectToServer(dispatch) {
	const ws = new WebSocket("ws://localhost:3000/listen")
	ws.addEventListener("error", () => {
		dispatch(StateEvents.Connecting)
		healthCheck(dispatch)
	})
	ws.addEventListener("open", () => {
		dispatch(StateEvents.Connected)
	})
	ws.addEventListener("message", message => {
		dispatch(JSON.parse(message.data))
	})
}

function initServer(dispatch) {
	function wrappedDispatch(event) {
		if (typeof event === "string") {
			dispatch({ type: event })
			return
		}
		dispatch(event)
	}
	wrappedDispatch(StateEvents.Connecting)
	connectToServer(wrappedDispatch)
}

export { initServer, StateEvents } 
