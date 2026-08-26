import {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);
const SOCKET_URL =
	import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

export function SocketProvider({ children }) {
	const { token, isAuthenticated } = useAuth();
	const socketRef = useRef(null);
	const [connected, setConnected] = useState(false);
	const [lastEvent, setLastEvent] = useState(null);

	useEffect(() => {
		if (!isAuthenticated || !token) {
			socketRef.current?.disconnect();
			socketRef.current = null;
			setConnected(false);
			return undefined;
		}

		const socket = io(SOCKET_URL, {
			transports: ["websocket"],
			auth: { token },
		});
		socketRef.current = socket;

		const handleConnect = () => setConnected(true);
		const handleDisconnect = () => setConnected(false);
		const handleAuditEvent = (event) => setLastEvent(event);
		const handleShipmentUpdate = (shipment) =>
			setLastEvent({ type: "SHIPMENT_UPDATED", data: shipment });
		const handleSensorData = (sensor) =>
			setLastEvent({ type: "SENSOR_DATA", data: sensor });

		socket.on("connect", handleConnect);
		socket.on("disconnect", handleDisconnect);
		socket.on("audit:event", handleAuditEvent);
		socket.on("shipment:updated", handleShipmentUpdate);
		socket.on("sensor:data", handleSensorData);

		return () => {
			socket.off("connect", handleConnect);
			socket.off("disconnect", handleDisconnect);
			socket.off("audit:event", handleAuditEvent);
			socket.off("shipment:updated", handleShipmentUpdate);
			socket.off("sensor:data", handleSensorData);
			socket.disconnect();
			socketRef.current = null;
		};
	}, [token, isAuthenticated]);

	const emit = (eventName, data) => {
		if (socketRef.current) {
			socketRef.current.emit(eventName, data);
		}
	};

	const subscribe = (eventName, callback) => {
		const socket = socketRef.current;
		if (!socket) return () => {};

		socket.on(eventName, callback);
		return () => socket.off(eventName, callback);
	};

	return (
		<SocketContext.Provider
			value={{
				socket: socketRef.current,
				connected,
				lastEvent,
				emit,
				subscribe,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
}

export function useSocket() {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error("useSocket must be used inside SocketProvider");
	}
	return context;
}

export default SocketContext;
