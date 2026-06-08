from flask import Blueprint, jsonify, request
from ..db.database import get_db

slots_bp = Blueprint('slots', __name__)

@slots_bp.route('/api/slots', methods=['GET'])
def get_slots():
    category = request.args.get('category')
    conn = get_db()
    if category and category != 'All':
        slots = conn.execute('SELECT * FROM slots WHERE category = ?', (category,)).fetchall()
    else:
        slots = conn.execute('SELECT * FROM slots').fetchall()
    conn.close()
    return jsonify([dict(s) for s in slots])

@slots_bp.route('/api/slots/<slot_id>', methods=['GET'])
def get_slot(slot_id):
    conn = get_db()
    slot = conn.execute('SELECT * FROM slots WHERE slot_id = ?', (slot_id,)).fetchone()
    conn.close()
    if not slot:
        return jsonify({'error': 'Slot not found'}), 404
    return jsonify(dict(slot))

@slots_bp.route('/api/slots/availability', methods=['GET'])
def get_availability():
    conn = get_db()
    rows = conn.execute('''
        SELECT category,
               COUNT(*) as total,
               SUM(CASE WHEN status = "available" THEN 1 ELSE 0 END) as available
        FROM slots GROUP BY category
    ''').fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])
