import React, { useState } from 'react';
import axiosInstance from '../../services/authServices';

const EventForm = ({ event, setEditEvent, refreshEvents }) => {
  const [formData, setFormData] = useState(event || {
    name: '',
    description: '',
    date: '',
    venue: '',
    registration_limit: '',
    subject: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.id) {
        // Update existing event
        await axiosInstance.put(`/api/events/${formData.id}`, formData); // Replace with actual API
        alert('Event updated successfully!');
      } else {
        // Create new event
        await axiosInstance.post('/api/events', formData); // Replace with actual API
        alert('Event created successfully!');
      }

      refreshEvents();
      setEditEvent(null); // Close the form
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event.');
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">
          {formData.id ? 'Edit Event' : 'Create Event'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Venue</label>
            <input
              type="text"
              name="venue"
              value={formData.venue || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Registration Limit</label>
            <input
              type="number"
              name="registration_limit"
              value={formData.registration_limit || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject || ''}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setEditEvent(null)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
