import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-1/4 h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      <ul className="space-y-4">
        <li>
          <NavLink
            to="/admin/events"
            className={({ isActive }) =>
              `block p-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`
            }
          >
            Events
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/reports"
            className={({ isActive }) =>
              `block p-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`
            }
          >
            Reports
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `block p-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`
            }
          >
            Settings
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
