import React, { useEffect, useState } from "react";
import axiosInstance from "../services/authServices";

const UpcomingEvents = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await axiosInstance.get("api/events/upcoming"); // Replace with your actual endpoint
        const futureEvents = response.data.filter(
          (event) => new Date(event.date) > new Date()
        );
        setUpcomingEvents(futureEvents);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };

    fetchUpcomingEvents();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <ul className="space-y-4">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <li key={event.id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{event.name}</h2>
              <p>{event.description}</p>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Venue: {event.venue}</p>
            </li>
          ))
        ) : (
          <p>No upcoming events.</p>
        )}
      </ul>
    </div>
  );
};

export default UpcomingEvents;
