import os
from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import pyodbc
from flask_cors import CORS

app = Flask(__name__)

app.config['SECRET_KEY'] = 'my-fixed-secret-key'
app.config['JWT_SECRET_KEY'] = 'my-fixed-jwt-secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=22)

CORS(app, resources={r"/api/*": {"origins": "*"}})

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

DATABASE_CONNECTION_STRING = 'Driver={ODBC Driver 17 for SQL Server};Server=UBAID;Database=EventManagement;UID=sa;PWD=Ubaid@123;'

def get_db_connection():
    return pyodbc.connect(DATABASE_CONNECTION_STRING)

@app.route('/')
def home():
    return "Hello, World! Event Management API is running!"

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json

    if not data or not all(k in data for k in ('username', 'email', 'password')):
        return jsonify({"error": "Missing required fields"}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM users WHERE username = ? OR email = ?", (data['username'], data['email']))
        if cursor.fetchone():
            return jsonify({"error": "Username or email already exists"}), 409

        cursor.execute(
            "INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)",
            (data['username'], data['email'], hashed_password, 'user')
        )
        conn.commit()
    except pyodbc.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        conn.close()

    return jsonify({"message": "User registered successfully"}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json

    if not data or not all(k in data for k in ('username', 'password')):
        return jsonify({"error": "Missing username or password"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id, password_hash, role FROM users WHERE username = ?", (data['username'],))
        user = cursor.fetchone()

        if user and bcrypt.check_password_hash(user[1], data['password']):
            access_token = create_access_token(identity=str(user[0]))
            return jsonify({
                "access_token": access_token,
                "user_id": user[0],
                "role": user[2]
            }), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    except pyodbc.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        conn.close()

@app.route('/api/events', methods=['GET'])
@jwt_required()
def list_events():
    status = request.args.get('status', 'open')

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id, name, description, date, venue, registration_limit, status FROM events WHERE status = ?", (status,))
        events = cursor.fetchall()

        result = []
        for event in events:
            cursor.execute("SELECT COUNT(*) FROM registrations WHERE event_id = ?", (event[0],))
            current_registrations = cursor.fetchone()[0]

            result.append({
                'id': event[0],
                'name': event[1],
                'description': event[2],
                'date': event[3].isoformat(),
                'venue': event[4],
                'registration_limit': event[5],
                'current_registrations': current_registrations,
                'status': event[6]
            })
    except pyodbc.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        conn.close()

    return jsonify(result), 200

@app.route('/api/events', methods=['POST'])
@jwt_required()
def create_event():
    current_user_id = get_jwt_identity()

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT role FROM users WHERE id = ?", (current_user_id,))
        user = cursor.fetchone()
        if not user or user[0] != 'admin':
            return jsonify({"error": "Unauthorized"}), 403

        data = request.json
        required_fields = ['name', 'description', 'date', 'venue', 'registration_limit']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required event fields"}), 400

        cursor.execute(
            "INSERT INTO events (name, description, date, venue, registration_limit, status) VALUES (?, ?, ?, ?, ?, ?)",
            (data['name'], data['description'], datetime.fromisoformat(data['date']), data['venue'], data['registration_limit'], 'open')
        )
        conn.commit()

        return jsonify({"message": "Event created successfully"}), 201
    except pyodbc.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        conn.close()

@app.route('/api/events/<int:event_id>/register', methods=['POST'])
@jwt_required()
def register_for_event(event_id):
    current_user_id = get_jwt_identity()

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT registration_limit FROM events WHERE id = ?", (event_id,))
        event = cursor.fetchone()
        if not event:
            return jsonify({"error": "Event not found"}), 404

        cursor.execute("SELECT COUNT(*) FROM registrations WHERE event_id = ?", (event_id,))
        current_registrations = cursor.fetchone()[0]
        if current_registrations >= event[0]:
            return jsonify({"error": "Event is full"}), 400

        cursor.execute("SELECT id FROM registrations WHERE user_id = ? AND event_id = ?", (current_user_id, event_id))
        if cursor.fetchone():
            return jsonify({"error": "Already registered for this event"}), 409

        cursor.execute("INSERT INTO registrations (user_id, event_id, registered_at) VALUES (?, ?, ?)",
                       (current_user_id, event_id, datetime.utcnow()))
        conn.commit()

        return jsonify({"message": "Successfully registered for the event"}), 201
    except pyodbc.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        conn.close()

@app.route('/api/events/<int:event_id>', methods=['PUT'])
@jwt_required()
def edit_event(event_id):
    current_user_id = get_jwt_identity()

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT role FROM users WHERE id = ?", (current_user_id,))
        user = cursor.fetchone()
        if not user or user[0] != 'admin':
            return jsonify({"error": "Unauthorized"}), 403

        data = request.json
        required_fields = ['name', 'description', 'date', 'venue', 'registration_limit', 'status']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        cursor.execute(""" 
            UPDATE events
            SET name = ?, description = ?, date = ?, venue = ?, registration_limit = ?, status = ?
            WHERE id = ?
        """, (
            data['name'],
            data['description'],
            datetime.fromisoformat(data['date']),
            data['venue'],
            data['registration_limit'],
            data['status'],
            event_id
        ))

        if cursor.rowcount == 0:
            return jsonify({"error": "Event not found"}), 404

        conn.commit()
        return jsonify({"message": "Event updated successfully"}), 200
    except pyodbc.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        conn.close()

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    current_user_id = get_jwt_identity()

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT role FROM users WHERE id = ?", (current_user_id,))
        user = cursor.fetchone()
        if not user or user[0] != 'admin':
            return jsonify({"error": "Unauthorized"}), 403

        cursor.execute("DELETE FROM events WHERE id = ?", (event_id,))
        if cursor.rowcount == 0:
            return jsonify({"error": "Event not found"}), 404

        conn.commit()
        return jsonify({"message": "Event deleted successfully"}), 200
    except pyodbc.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        conn.close()

@app.route('/api/events/upcoming', methods=['GET'])
@jwt_required()
def get_upcoming_events():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, name, description, date, venue, registration_limit, status
            FROM events
            WHERE date >= ? AND status = 'open'
            ORDER BY date ASC
        """, (datetime.utcnow(),))
        events = cursor.fetchall()

        result = [
            {
                'id': event[0],
                'name': event[1],
                'description': event[2],
                'date': event[3].isoformat(),
                'venue': event[4],
                'registration_limit': event[5],
                'status': event[6],
            }
            for event in events
        ]

        return jsonify(result), 200
    except pyodbc.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        conn.close()
@app.route('/api/event/<int:event_id>/close', methods=['PUT'])
def close_event(event_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("UPDATE events SET status = ? WHERE id = ?", ('closed', event_id))

        conn.commit()

        if cursor.rowcount > 0:
            return jsonify({'message': f'Event {event_id} closed successfully', 'status': 'closed'}), 200
        else:
            return jsonify({'message': f'Event {event_id} not found or already closed'}), 404
    except pyodbc.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        conn.close()

@app.route('/api/dashboard/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM users")
        total_users = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM events")
        total_events = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM registrations")
        total_registrations = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM events WHERE status = 'open'")
        total_open_events = cursor.fetchone()[0]


        stats = {
            'total_users': total_users,
            'total_events': total_events,
            'total_registrations': total_registrations,
            'total_open_events': total_open_events
        }

        return jsonify(stats), 200
    except pyodbc.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        conn.close()

@app.route('/api/events/registered', methods=['GET'])
@jwt_required()
def get_registered_events():
    current_user_id = get_jwt_identity()

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT e.id, e.name, e.description, e.date, e.venue, e.registration_limit, e.status
            FROM events e
            JOIN registrations r ON e.id = r.event_id
            WHERE r.user_id = ?
            ORDER BY e.date ASC
        """, (current_user_id,))
        events = cursor.fetchall()

        result = [
            {
                'id': event[0],
                'name': event[1],
                'description': event[2],
                'date': event[3].isoformat(),
                'venue': event[4],
                'registration_limit': event[5],
                'status': event[6],
            }
            for event in events
        ]

        return jsonify(result), 200
    except pyodbc.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        conn.close()

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
