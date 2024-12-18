# Event Management System

A web-based system for managing events with role-based access control (RBAC), built with **Flask** for the backend, **MSSQL** for the database, and **React** for the frontend. This application allows administrators to manage events, participants, and secure access to the system, while users can view and register for events.

---

## 📋 **Objective**

Develop a secure web-based system for managing events with proper role-based access control. The application supports two user roles: **Admin** and **User**.

- **Admin**: Can create, edit, delete events, manage participants, and view/export event details.
- **User**: Can view events and register for them, within the event’s registration limit.

---

## **Features**

### 🔐 **User Authentication & Security**

- **Role-Based Access Control (RBAC)**:
  - **Admin**: Can manage all aspects of events and users.
  - **User**: Can only view events and register for them.

- **Secure Authentication**:
  - User credentials are securely stored with encryption (using bcrypt or similar hashing mechanisms).
  - Secure API endpoints with input validation and prevention of common vulnerabilities (SQL Injection, XSS).

- **JWT Authentication**:
  - **JSON Web Tokens (JWT)** are used for user authentication and session management.
  - After logging in, users receive a JWT token that they must include in the `Authorization` header for accessing protected API endpoints.
  - The backend verifies the JWT for every request to ensure security and proper access control.
  
  Example of Authorization Header:
  ```http
  Authorization: Bearer <your-jwt-token>
