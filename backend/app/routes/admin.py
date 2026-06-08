from flask import Blueprint, jsonify, request
from ..db.database import get_db

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/api/admin/stats', methods=['GET'])
def get_stats():
    conn = get_db()
    total_slots = conn.execute('SELECT COUNT(*) FROM slots').fetchone()[0]
    occupied = conn.execute('SELECT COUNT(*) FROM slots WHERE status = "occupied"').fetchone()[0]
    total_bookings = conn.execute('SELECT COUNT(*) FROM bookings').fetchone()[0]
    revenue = conn.execute('SELECT COALESCE(SUM(amount_paid), 0) FROM bookings WHERE status = "completed"').fetchone()[0]
    conn.close()
    return jsonify({
        'total_slots': total_slots,
        'occupied': occupied,
        'available': total_slots - occupied,
        'occupancy_rate': round((occupied / total_slots) * 100, 1) if total_slots else 0,
        'total_bookings': total_bookings,
        'total_revenue': round(revenue, 2)
    })

@admin_bp.route('/api/admin/rates', methods=['GET'])
def get_rates():
    conn = get_db()
    rates = conn.execute('SELECT * FROM rate_settings').fetchall()
    conn.close()
    return jsonify([dict(r) for r in rates])

@admin_bp.route('/api/admin/rates', methods=['PUT'])
def update_rates():
    data = request.get_json()
    category = data.get('category')
    rate = data.get('rate_per_hour')
    if not category or rate is None:
        return jsonify({'error': 'Missing fields'}), 400
    conn = get_db()
    conn.execute('UPDATE rate_settings SET rate_per_hour = ? WHERE category = ?', (rate, category))
    conn.execute('UPDATE slots SET rate_per_hour = ? WHERE category = ?', (rate, category))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Rate updated'})

@admin_bp.route('/', methods=['GET'])
def health():
    return jsonify({'status': 'ParkSmart API running'})
