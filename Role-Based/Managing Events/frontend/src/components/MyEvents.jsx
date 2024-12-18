import React, { useEffect, useState } from "react";
import axiosInstance from "../services/authServices";
const MyEvents = () => {
  const [myEvents, setMyEvents] = useState([]);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await axiosInstance.get("api/events/registered");  
        setMyEvents(response.data);
      } catch (error) {
        console.error("Error fetching my events:", error);
      }
    };

    fetchMyEvents();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Events</h1>
      <ul className="space-y-4">
        {myEvents.length > 0 ? (
          myEvents.map((event) => (
            <li key={event.id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{event.name}</h2>
              <p>{event.description}</p>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Venue: {event.venue}</p>
            </li>
          ))
        ) : (
          <p>No registered events.</p>
        )}
      </ul>
    </div>
  );
};

export default MyEvents;
