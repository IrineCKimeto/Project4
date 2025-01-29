from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configure your database URI here
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'  # Example for SQLite
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize the database with the app
    db.init_app(app)

    with app.app_context():
        from models import User, Book, Review  # Import models here
        db.create_all()  # Ensure tables are created

    # Register routes
    from routes import api_routes
    app.register_blueprint(api_routes)

    return app
