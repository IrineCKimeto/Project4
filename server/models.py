from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    reviews = db.relationship('Review', back_populates='user', lazy=True)  # Back-populates Review.user


class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    author = db.Column(db.String(120), nullable=False)
    genre = db.Column(db.String(80), nullable=False)
    reviews = db.relationship('Review', back_populates='book', lazy=True)  # Back-populates Review.book

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "genre": self.genre
        }


class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    user = db.relationship('User', back_populates='reviews')  # Back-populates User.reviews
    book = db.relationship('Book', back_populates='reviews')  # Add this relationship
