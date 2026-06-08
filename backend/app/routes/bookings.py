from flask import Blueprint, jsonify, request
from ..db.database import get_db
import uuid
from datetime import datetime

bookings_bp = Blueprint('bookings', __name__)

@bookings_bp.route('/api/book', methods=['POST'])
def create_booking():
    data = request.get_json()
    slot_id = data.get('slot_id')
    driver_name = data.get('driver_name')
    vehicle_number = data.get('vehicle_number')
    vehicle_type = data.get('vehicle_type')

    if not all([slot_id, driver_name, vehicle_number, vehicle_type]):
        return jsonify({'error': 'Missing fields'}), 400

    conn = get_db()
    slot = conn.execute('SELECT * FROM slots WHERE slot_id = ?', (slot_id,)).fetchone()

    if not slot:
        conn.close()
        return jsonify({'error': 'Slot not found'}), 404

    if slot['status'] != 'available':
        conn.close()
        return jsonify({'error': 'Slot not available'}), 409

    booking_id = str(uuid.uuid4())
    arrival_time = datetime.utcnow().isoformat()

    conn.execute(
        'INSERT INTO bookings (booking_id, slot_id, driver_name, vehicle_number, vehicle_type, arrival_time) VALUES (?, ?, ?, ?, ?, ?)',
        (booking_id, slot_id, driver_name, vehicle_number, vehicle_type, arrival_time)
    )
    conn.execute('UPDATE slots SET status = "occupied" WHERE slot_id = ?', (slot_id,))
    conn.commit()
    conn.close()

    return jsonify({'booking_id': booking_id, 'slot_id': slot_id, 'arrival_time': arrival_time}), 201

@bookings_bp.route('/api/checkout/<booking_id>', methods=['POST'])
def checkout(booking_id):
    conn = get_db()
    booking = conn.execute('SELECT * FROM bookings WHERE booking_id = ?', (booking_id,)).fetchone()

    if not booking:
        conn.close()
        return jsonify({'error': 'Booking not found'}), 404

    checkout_time = datetime.utcnow().isoformat()
    arrival = datetime.fromisoformat(booking['arrival_time'])
    duration_hours = (datetime.utcnow() - arrival).total_seconds() / 3600

    slot = conn.execute('SELECT * FROM slots WHERE slot_id = ?', (booking['slot_id'],)).fetchone()
    amount = round(duration_hours * slot['rate_per_hour'], 2)

    conn.execute(
        'UPDATE bookings SET checkout_time = ?, amount_paid = ?, status = "completed" WHERE booking_id = ?',
        (checkout_time, amount, booking_id)
    )
    conn.execute('UPDATE slots SET status = "available" WHERE slot_id = ?', (booking['slot_id'],))
    conn.commit()
    conn.close()

    return jsonify({'booking_id': booking_id, 'amount_paid': amount, 'checkout_time': checkout_time})

@bookings_bp.route('/api/bookings', methods=['GET'])
def get_bookings():
    conn = get_db()
    bookings = conn.execute('SELECT * FROM bookings ORDER BY arrival_time DESC').fetchall()
    conn.close()
    return jsonify([dict(b) for b in bookings])

@bookings_bp.route('/api/bookings/active', methods=['GET'])
def get_active_bookings():
    conn = get_db()
    bookings = conn.execute('SELECT * FROM bookings WHERE status = "active"').fetchall()
    conn.close()
    return jsonify([dict(b) for b in bookings])
