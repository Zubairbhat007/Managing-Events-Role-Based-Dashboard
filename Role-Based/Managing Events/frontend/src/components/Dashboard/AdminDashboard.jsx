import React, { useState, useEffect } from 'react';
import Sidebar from '../Admin/Sidebar';
import EventForm from '../Admin/EventForm';
import axiosInstance from '../../services/authServices';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/api/events'); // Replace with actual API
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);
  const closeEvent = async (eventId) => {
    try {
        const response = await axiosInstance.put(`api/event/${eventId}/close`);
        const data = response.data; // Get the response data from the axios response
        alert(data.message); // Alert with success message
        // Update the local state to reflect the change
        setEvents(events.map(event =>
            event.id === eventId ? { ...event, status: 'closed' } : event
        ));
    } catch (error) {
        console.error('Error closing event:', error);
    }
};
  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axiosInstance.delete(`/api/events/${id}`); // Replace with actual API
        setEvents(events.filter((event) => event.id !== id));
        alert('Event deleted successfully!');
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event.');
      }
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-3/4 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Manage Events</h1>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => setEditEvent({})} // Open the form for creating a new event
          >
            Create Event
          </button>
        </div>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Venue</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td className="py-2 px-4 border-b">{event.id}</td>
                <td className="py-2 px-4 border-b">{event.name}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(event.date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">{event.venue}</td>
                <td className="py-2 px-4 border-b">{event.status}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => setEditEvent(event)} // Pass the event to the form
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(event.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded m-2"
                    onClick={() => closeEvent(event.id)}
                  >
                    Close Event
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editEvent && (
          <EventForm
            event={editEvent}
            setEditEvent={setEditEvent}
            refreshEvents={() => {
              axiosInstance.get('/api/events').then((res) => setEvents(res.data));
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
