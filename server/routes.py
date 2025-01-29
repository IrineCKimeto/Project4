from flask import Blueprint, request, jsonify
from models import db, User, Book, Review

api_routes = Blueprint('api', __name__)


@api_routes.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the Personal Library API!"})


# USERS


# GET: Fetch all users
@api_routes.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([
        {"id": user.id, "name": user.name, "email": user.email} for user in users
    ]), 200

# POST: Create a new user
@api_routes.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()
    if not data or 'name' not in data or 'email' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"error": "Email already exists"}), 400

    new_user = User(name=data['name'], email=data['email'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email
    }), 201

# DELETE: Remove a user
@api_routes.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200


# BOOKS


# GET: Fetch all books with reviews and users
@api_routes.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    return jsonify([
        {
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "genre": book.genre,
            "reviews": [
                {
                    "id": review.id,
                    "content": review.content,
                    "rating": review.rating,
                    "user": {"id": review.user.id, "name": review.user.name}
                }
                for review in book.reviews
            ]
        }
        for book in books
    ]), 200

# GET: Fetch a single book with its reviews
@api_routes.route('/books/<int:id>', methods=['GET'])
def get_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    return jsonify({
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "genre": book.genre,
        "reviews": [
            {
                "id": review.id,
                "content": review.content,
                "rating": review.rating,
                "user": {"id": review.user.id, "name": review.user.name}
            }
            for review in book.reviews
        ]
    }), 200

# POST: Add a new book
@api_routes.route('/books', methods=['POST'])
def add_book():
    data = request.get_json()
    if not data or 'title' not in data or 'author' not in data or 'genre' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    new_book = Book(title=data['title'], author=data['author'], genre=data['genre'])
    db.session.add(new_book)
    db.session.commit()
    return jsonify({
        "id": new_book.id,
        "title": new_book.title,
        "author": new_book.author,
        "genre": new_book.genre
    }), 201

# PUT: Update a book
@api_routes.route('/books/<int:id>', methods=['PUT'])
def update_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    data = request.get_json()
    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    book.genre = data.get('genre', book.genre)
    db.session.commit()

    return jsonify({
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "genre": book.genre
    }), 200

# DELETE: Remove a book
@api_routes.route('/books/<int:id>', methods=['DELETE'])
def delete_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    
    Review.query.filter_by(book_id=id).delete()
    
    
    db.session.delete(book)
    db.session.commit()

    return jsonify({"message": "Book and associated reviews deleted"}), 200


# REVIEWS


# GET: Fetch all reviews
@api_routes.route('/reviews', methods=['GET'])
def get_all_reviews():
    reviews = Review.query.all()
    return jsonify([
        {
            "id": review.id,
            "content": review.content,
            "rating": review.rating,
            "book": {
                "id": review.book.id if review.book else None,
                "title": review.book.title if review.book else "Unknown Book"
            },
            "user": {
                "id": review.user.id if review.user else None,
                "name": review.user.name if review.user else "Unknown User"
            }
        }
        for review in reviews
    ]), 200

# GET: Fetch all reviews for a specific book
@api_routes.route('/books/<int:book_id>/reviews', methods=['GET'])
def get_reviews(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    return jsonify([
        {
            "id": review.id,
            "content": review.content,
            "rating": review.rating,
            "user": {
                "id": review.user.id,
                "name": review.user.name
            }
        }
        for review in book.reviews
    ]), 200

# POST: Add a new review
@api_routes.route('/reviews', methods=['POST'])
def add_review():
    data = request.get_json()
    if not data or 'content' not in data or 'rating' not in data or 'user_id' not in data or 'book_id' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    new_review = Review(
        content=data['content'],
        rating=data['rating'],
        user_id=data['user_id'],
        book_id=data['book_id']
    )
    db.session.add(new_review)
    db.session.commit()

    return jsonify({
        "id": new_review.id,
        "content": new_review.content,
        "rating": new_review.rating,
        "user_id": new_review.user_id,
        "book_id": new_review.book_id
    }), 201

# PUT: Update a review
@api_routes.route('/reviews/<int:id>', methods=['PUT'])
def update_review(id):
    review = Review.query.get(id)
    if not review:
        return jsonify({"error": "Review not found"}), 404

    data = request.get_json()
    review.content = data.get('content', review.content)
    review.rating = data.get('rating', review.rating)
    db.session.commit()

    return jsonify({
        "id": review.id,
        "content": review.content,
        "rating": review.rating,
        "user_id": review.user_id,
        "book_id": review.book_id
    }), 200

# DELETE: Remove a review
@api_routes.route('/reviews/<int:id>', methods=['DELETE'])
def delete_review(id):
    review = Review.query.get(id)
    if not review:
        return jsonify({"error": "Review not found"}), 404

    db.session.delete(review)
    db.session.commit()
    return jsonify({"message": "Review deleted"}), 200
