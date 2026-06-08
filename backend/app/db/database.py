import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'parksmart.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.executescript('''
        CREATE TABLE IF NOT EXISTS slots (
            slot_id TEXT PRIMARY KEY,
            category TEXT NOT NULL,
            status TEXT DEFAULT 'available',
            rate_per_hour REAL DEFAULT 10.0,
            pos_x INTEGER,
            pos_y INTEGER
        );

        CREATE TABLE IF NOT EXISTS bookings (
            booking_id TEXT PRIMARY KEY,
            slot_id TEXT NOT NULL,
            driver_name TEXT NOT NULL,
            vehicle_number TEXT NOT NULL,
            vehicle_type TEXT NOT NULL,
            arrival_time TEXT NOT NULL,
            checkout_time TEXT,
            amount_paid REAL DEFAULT 0,
            status TEXT DEFAULT 'active',
            FOREIGN KEY (slot_id) REFERENCES slots(slot_id)
        );

        CREATE TABLE IF NOT EXISTS rate_settings (
            category TEXT PRIMARY KEY,
            rate_per_hour REAL NOT NULL
        );
    ''')

    # Seed slots if empty
    existing = cursor.execute('SELECT COUNT(*) FROM slots').fetchone()[0]
    if existing == 0:
        categories = [('2W', 30), ('4W', 50), ('EV', 10), ('Disabled', 5)]
        slot_num = 1
        for cat, count in categories:
            for i in range(1, count + 1):
                slot_id = f"{cat}-{str(i).zfill(3)}"
                cursor.execute(
                    'INSERT INTO slots (slot_id, category, status, rate_per_hour, pos_x, pos_y) VALUES (?, ?, ?, ?, ?, ?)',
                    (slot_id, cat, 'available', 10.0, (i-1) % 12, (i-1) // 12)
                )
        conn.commit()

    # Seed rates if empty
    rate_existing = cursor.execute('SELECT COUNT(*) FROM rate_settings').fetchone()[0]
    if rate_existing == 0:
        for cat, _ in [('2W', 30), ('4W', 50), ('EV', 10), ('Disabled', 5)]:
            cursor.execute('INSERT INTO rate_settings (category, rate_per_hour) VALUES (?, ?)', (cat, 10.0))
        conn.commit()

    conn.close()
