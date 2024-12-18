import React, { useEffect, useState } from "react";
import axiosInstance from "../services/authServices";

const Events = () => {
  const [events, setEvents] = useState([]);
  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchData();
  }, []);

  // Handle registration
  const handleRegister = async (eventId) => {
    debugger
    const userResponse = prompt("Are you sure you want to register? Type 'yes' to confirm.");
    if (userResponse && userResponse.toLowerCase() === "yes") {
      try {
        const response = await axiosInstance.post(`/api/events/${eventId}/register`);
        alert(`Registration successful: ${response.data.message || "You have been registered!"}`);
      } catch (error) {
        console.error("Error registering:", error);
        alert(`Registration failed: ${error?.response?.data?.error|| "Please try again later."}`);
      }
    } else {
      alert("Registration canceled.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Venue</th>
              <th className="border border-gray-300 px-4 py-2">Current Registrations</th>
              <th className="border border-gray-300 px-4 py-2">Limit</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{event.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{event.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{event.description}</td>
                  <td className="border border-gray-300 px-4 py-2">{new Date(event.date).toLocaleDateString()}</td>
                  <td className="border border-gray-300 px-4 py-2">{event.venue}</td>
                  <td className="border border-gray-300 px-4 py-2">{event.current_registrations}</td>
                  <td className="border border-gray-300 px-4 py-2">{event.registration_limit}</td>
                  <td className="border border-gray-300 px-4 py-2">{event.status}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleRegister(event.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Register
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center border border-gray-300 px-4 py-2">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Events;
