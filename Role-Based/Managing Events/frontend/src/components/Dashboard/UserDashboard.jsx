import React, { useState } from 'react';
import Events from '../Events'; 
import MyEvents from '../MyEvents';
import UpcomingEvents from '../UpcommingEvents';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("myEvents"); // Track the active tab

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <button
              className={`w-full text-left p-2 rounded ${activeTab === "myEvents" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              onClick={() => setActiveTab("myEvents")}
            >
              My Events
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left p-2 rounded ${activeTab === "upcomingEvents" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              onClick={() => setActiveTab("upcomingEvents")}
            >
              Upcoming Events
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left p-2 rounded ${activeTab === "allEvents" ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
              onClick={() => setActiveTab("allEvents")}
            >
              All Events
            </button>
          </li>
        </ul>
      </div>

      {/* Content Area */}
      <div className="w-3/4 p-4">
        {activeTab === "myEvents" && <MyEvents />}
        {activeTab === "upcomingEvents" && <UpcomingEvents />}
        {activeTab === "allEvents" && <Events />}
      </div>
    </div>
  );
};

export default UserDashboard;
