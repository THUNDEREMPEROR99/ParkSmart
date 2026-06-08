from flask import Flask
from flask_cors import CORS
from .db.database import init_db

def create_app():
    app = Flask(__name__)
    CORS(app)

    with app.app_context():
        init_db()

    from .routes.slots import slots_bp
    from .routes.bookings import bookings_bp
    from .routes.admin import admin_bp

    app.register_blueprint(slots_bp)
    app.register_blueprint(bookings_bp)
    app.register_blueprint(admin_bp)

    return app
