from modules import *

app = Flask(__name__, static_folder='../frontend/build')
CORS(app)

app.secret_key = "my_secret"
app.permanent_session_lifetime = timedelta(minutes=10) # seems short but gets extended when user activity is detected


# ROUTES

@app.route('/extendsess', methods=['GET'])
def extend_session():
    if session:
        session.modified = True

        return jsonify({"message": "session extended successfully"}), 200
    else:
        return jsonify({"error": "no active session"}), 400



# AUTH

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if session:
        return jsonify({"error": "Already logged in"}), 400
    if request.method == 'POST':
        data = request.get_json()
        name, email, pw = data.values()

        if not db.user_exists(email):
            print('not exist')
            db.create_user(name, email, pw)

            return jsonify({"message": "success"}, 200)
        else:
            print('user exists')
            return jsonify({"error": "A user with that email already exists"}), 400
    else:
        return send_from_directory(app.static_folder, 'index.html'), 200

@app.route('/login', methods=['GET', 'POST'])
def login():
    if session:
        return jsonify({"error": "Already logged in"}), 400
    if request.method == 'POST':
        data = request.get_json()
        email, pw = data.values()

        check = db.user_exists(email)

        if check:
            check = db.check_pw(email, pw)
            if check:
                user = db.read_user(email=email)

                session.permanent = True
                session.modified = True

                session['id'] = user.id
                session['email'] = user.email
                session['name'] = user.name
                session['role'] = user.role

                return jsonify({"message": "logged in successfully"}), 200
            return jsonify({"error": "Incorrect password, please try again"}), 400
        return jsonify({"error": "A user with that email address does not exist"}), 400
    return send_from_directory(app.static_folder, 'index.html'), 200

@app.route('/logout', methods=['GET'])
def logout():
    if session:
        session.clear()

        return jsonify({"message": "logged out successfully"}), 200
    return jsonify({"error": "no active session"}), 400


# BOOKS
@app.route('/books', methods=['GET'])
def get_books():
    data = db.read_books_all()

    return jsonify({"message": "books fetched successfully", "data": data})

@app.route('/books/query', methods=['GET', 'POST'])
def get_books_by_title():
    if request.method == 'POST':
        data = request.get_json()
        title = data['title']

        book = db.read_book(title=title)

        if book:
            return jsonify({"message": "book fetched successfully", "data": book}), 200
        return jsonify({"error": "We're sorry but we have no books that match that title"}), 400
    return send_from_directory(app.static_folder, 'index.html'), 200

@app.route('/books/genres', methods=['GET', 'POST'])
def get_books_by_genre():
    if request.method == 'POST':
        data = request.get_json()
        genres = data['genres'].values()
        literary_types = data['literary_types'].values()

        if genres:
            if literary_types:
                data = db.read_books_filtered(genres=genres, literary_types=literary_types)
            else:
                data = db.read_books_filtered(genres=genres)

            return jsonify({"message": "books fetched successfully", "data": data}), 200
        elif not genres and literary_types:
            data = db.read_books_filtered(literary_types = literary_types)

            return jsonify({"message": "books fetched successfully", "data": data}), 200
        else:
            data = db.read_books_all()

            return jsonify({"message": "books fetched successfully", "data": data}), 200
    return send_from_directory(app.static_folder, 'index.html'), 200

@app.route('/books/sort', methods=['GET', 'POST'])
def sort_books():
    if request.method == 'POST':
        data = request.get_json()
        filter = data['name']

        data = db.read_books_filtered(sortby=filter)

        return jsonify({"message": "books fetched successfully", "data": data})



# BOOK

@app.route('/book/<int:isbn>', methods=['GET'])
def get_book(isbn):
    data = db.read_book(isbn=isbn)

    if data:
        return jsonify({"message": "book fetched successfully", "data": data}), 200
    else:
        return jsonify({"error": "book not found"}), 404

@app.route('/book/add', methods=['GET', 'POST'])
def add_book():
    if session:
        if request.method == 'POST':
            data = request.get_json()
            isbn, title, genre, author, num_copies = data.values()

            db.create_book(isbn, title, genre, author, num_copies)

            return jsonify({"message": "book created successfully"}), 200

        return send_from_directory(app.static_folder, 'index.html'), 200
    return jsonify({"error": "no session"}), 400


# MAIN

if __name__ == '__main__':
    db.setup()
    app.run()