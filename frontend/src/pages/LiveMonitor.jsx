import {
  Activity,
  Thermometer,
  MapPin,
  Wifi,
  Clock,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

export default function LiveMonitor() {
  const { connected, lastEvent } = useSocket();

  const [events, setEvents] = useState([
    {
      id: 1,
      container: "CONT-2026-001",
      temperature: 4.2,
      location: "Hyderabad",
      time: "Just now",
    },
    {
      id: 2,
      container: "CONT-2026-002",
      temperature: 7.8,
      location: "Vijayawada",
      time: "1 min ago",
    },
    {
      id: 3,
      container: "CONT-2026-003",
      temperature: 5.1,
      location: "Visakhapatnam",
      time: "3 min ago",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents((previous) =>
        previous.map((event) => ({
          ...event,
          temperature: (
            event.temperature +
            (Math.random() - 0.5)
          ).toFixed(1),
        }))
      );
    }, 5000);

    return () =>
      clearInterval(interval);
  }, []);

  useEffect(() => {
    if (lastEvent) {
      console.log("New live event:", lastEvent);
    }
  }, [lastEvent]);

  return (
    <div className="live-monitor-page">

      <div className="page-header">

        <div>
          <h1>Live Monitor</h1>

          <p>
            Real-time shipment and sensor
            monitoring.
          </p>
        </div>

        <div
          className={`connection-status ${
            connected
              ? "connected"
              : "disconnected"
          }`}
        >
          <Wifi size={17} />

          {connected ? "Live Connected" : "Offline"}
        </div>

      </div>

      <div className="live-stats">

        <LiveStat
          icon={<Activity />}
          title="Live Events"
          value={events.length}
        />

        <LiveStat
          icon={<Thermometer />}
          title="Sensors Online"
          value="24"
        />

        <LiveStat
          icon={<MapPin />}
          title="Active Routes"
          value="18"
        />

        <LiveStat
          icon={<Wifi />}
          title="Connection"
          value={
            connected
              ? "Healthy"
              : "Offline"
          }
        />

      </div>

      <div className="live-events-card">

        <div className="section-header">
          <div>
            <h2>Live Sensor Events</h2>

            <p>
              Latest incoming shipment data
            </p>
          </div>

          <span className="live-indicator">
            <span></span>
            LIVE
          </span>
        </div>

        <div className="live-event-list">

          {events.map((event) => (
            <div
              className="live-event"
              key={event.id}
            >

              <div className="live-event-icon">
                <Thermometer
                  size={19}
                />
              </div>

              <div className="live-event-info">

                <strong>
                  {event.container}
                </strong>

                <span>
                  Temperature:{" "}
                  {event.temperature}°C
                </span>

                <span>
                  <MapPin size={13} />

                  {event.location}
                </span>

              </div>

              <div className="live-event-time">
                <Clock size={14} />

                {event.time}
              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

function LiveStat({
  icon,
  title,
  value,
}) {
  return (
    <div className="live-stat-card">

      <div className="live-stat-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>

        <strong>{value}</strong>
      </div>

    </div>
  );
}