import bcrypt
import os
from sqlalchemy import create_engine, Column, String, Integer, ForeignKey, inspect, MetaData, select, insert, and_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

base = declarative_base()


# TABLE SETUP

class Book(base):
    __tablename__ = "Books"

    isbn = Column(Integer, unique=True, primary_key=True)
    title = Column(String)
    genre = Column(String)
    literary_type = Column(String)
    author = Column(String)
    num_copies = Column(Integer)
    date_created = Column(String)
    date_added = Column(String)

    borrows = relationship('Borrow', back_populates='book')

    def __init__(self, isbn, title, genre, literary_type, author, num_copies, date_created, date_added):
        self.isbn = isbn
        self.title = title
        self.genre = genre
        self.literary_type = literary_type
        self.author = author
        self.num_copies = num_copies
        self.date_created = date_created
        self.date_added = date_added

class Member(base):
    __tablename__ = "Members"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    role = Column(String, default='User')

    borrows = relationship('Borrow', back_populates='member')

    def __init__(self, name, email, pw, role=None):
        self.name = name
        self.email = email
        self.password = pw

        if role:
            self.role = role

class Borrow(base):
    __tablename__ = "Borrow"

    id = Column(Integer, primary_key=True, autoincrement=True)
    isbn = Column(Integer, ForeignKey('Books.isbn'))
    lend_date = Column(String)
    due_date = Column(String)
    member_id = Column(Integer, ForeignKey('Members.id'))

    book = relationship('Book', back_populates='borrows')
    member = relationship('Member', back_populates='borrows')

    def __init__(self, isbn, lend_date, due_date, member_id):
        self.isbn = isbn
        self.lend_date = lend_date
        self.due_date = due_date
        self.member_id = member_id


# DB FILE SETUP

basedir = os.path.abspath(os.path.dirname(__file__))
instance_dir = os.path.join(basedir, '..', 'instance')
instance_dir = os.path.abspath(instance_dir)

if not os.path.exists(instance_dir):
    os.makedirs(instance_dir)

db_path = os.path.join(instance_dir, 'mydb.db')


# SQLALCHEMY SETUP

engine = create_engine(f"sqlite:///{db_path}", echo=True)
base.metadata.create_all(bind=engine)

metadata = MetaData()
metadata.reflect(bind=engine)

Session = sessionmaker(bind=engine)

inspector = inspect(engine)

MEMBERS = metadata.tables['Members']
BOOKS = metadata.tables['Books']
BORROW = metadata.tables['Borrow']


# DB FUNCTIONS


# SETUP

def setup():
    with Session() as session:
        check = session.query(Member).filter(and_(Member.email == 'admin@arcadialibrary.com')).one_or_none()

    if check:
        return

    pw = enc_pw("admin123")
    admin = Member(name="Admin", email="admin@arcadialibrary.com", pw=pw, role="Admin")
    book1 = Book(isbn=123654984654, title="Book One", genre="Action & Adventure", literary_type="Fiction", author="John Smith", num_copies=5, date_created="2022-06-01", date_added="2022-09-01")
    book2 = Book(isbn=156165616515, title="Book Two", genre="Crime", literary_type="Non-Fiction", author="Jane Smith", num_copies=7, date_created="2023-02-28", date_added="2023-11-06")

    with Session() as session:
        session.add(admin)
        session.add(book1)
        session.add(book2)
        session.commit()

    print("Database setup completed")


# USERS

def user_exists(email):
    with Session() as session:
        user = session.query(Member).filter(and_(Member.email == email)).one_or_none()
        session.close()

    if user:
        return True
    return False

def create_user(name, email, pw):
    pw = enc_pw(pw)

    user = Member(name=name, email=email, pw=pw)

    with Session() as session:
        session.add(user)
        session.commit()

def read_user(**kwargs):
    id = kwargs.get('id', None)
    email = kwargs.get('email', None)
    print('email', email)
    with Session() as session:
        if id:
            user = session.query(Member).filter(and_(Member.id == id)).one_or_none()
        else:
            user = session.query(Member).filter(and_(Member.email == email)).one_or_none()

        session.close()

    return user

def update_user(id, updates):
    with Session() as session:
        user = session.query(Member).filter(and_(Member.id == id)).one_or_none()

        if user:
            for col, val in updates.items():
                setattr(user, col, val)

            session.commit()

def delete_user(id):
    with Session() as session:
        user = session.query(Member).filter(and_(Member.id == id)).one_or_none()

        if user:
            session.delete(user)

            session.commit()
        session.close()

def enc_pw(pw):
    bytes = pw.encode('utf-8')
    salt = bcrypt.gensalt()
    hash = bcrypt.hashpw(bytes, salt)

    return hash

def check_pw(email, pw):
    with Session() as session:
        user = session.query(Member).filter(and_(Member.email == email)).one_or_none()
        user_pw = user.password
        bytes = pw.encode('utf-8')

        res = bcrypt.checkpw(bytes, user_pw)

        return res


# BOOKS

def create_book(isbn, title, genre, author, num_copies):
    book = Book(isbn=isbn, title=title, genre=genre, author=author, num_copies=num_copies)

    with Session() as session:
        session.add(book)

        session.commit()

def read_book(**kwargs):
    isbn = kwargs.get('isbn', None)
    title = kwargs.get('title', None)

    with Session() as session:
        if isbn:
            book = session.query(Book).filter(and_(Book.isbn == isbn)).one_or_none()
        else:
            book = session.query(Book).filter(and_(Book.title == title)).all()

        session.close()
    return book

def read_books_filtered(**kwargs):
    genres = kwargs.get('genres', None)
    sortby = kwargs.get('sortby', None)
    literary_types = kwargs.get('literary_types', None)

    with Session() as session:
        if genres or literary_types:
            books_lst = []

            if literary_types and genres:
                for lt in literary_types:
                    for genre in genres:
                        books = session.query(Book).filter(and_(Book.genre == genre, Book.literary_type == lt))
                        books_lst.append(books)
                books_lst = list(dict.fromkeys(books_lst)) # removes duplicates by converting to dict temporarily as dict keys cannot be the same
            elif genres and not literary_types:
                for genre in genres:
                    books = session.query(Book).filter(and_(Book.genre == genre)).all()
                    books_lst.append(books)
            else:
                for lt in literary_types:
                    books = session.query(Book).filter(and_(Book.literary_type == lt)).all()
                    books_lst.append(books)

            session.close()

            books_dict = {}

            for books in books_lst:
                for book in books:
                    books_dict[book.isbn] = {
                        'isbn': book.isbn,
                        'title': book.title,
                        'genre': book.genre,
                        'literary_type': book.literary_type,
                        'author': book.author,
                        'num_copies': book.num_copies,
                        'date_created': book.date_created,
                        'date_added': book.date_added
                    }

            books = books_dict
        else:
            books = session.query(Book).all()

            session.close()

            books_dict = {}

            match sortby:
                case "a-z" | "z-a":
                    for book in books:
                        books_dict[book.title] = {
                            'isbn': book.isbn,
                            'title': book.title,
                            'genre': book.genre,
                            'literary_type': book.literary_type,
                            'author': book.author,
                            'num_copies': book.num_copies,
                            'date_created': book.date_created,
                            'date_added': book.date_added
                        }

                    if sortby == "a-z":
                        sorted_books = sorted(books_dict.items(), key=lambda item: item[0])
                    else:
                        sorted_books = sorted(books_dict.items(), key=lambda item: item[0], reverse=True)

                    books = [book_data for _, book_data in sorted_books]

                case "newest" | "oldest":
                    for book in books:
                        books_dict[book.date_created] = {
                            'isbn': book.isbn,
                            'title': book.title,
                            'genre': book.genre,
                            'literary_type': book.literary_type,
                            'author': book.author,
                            'num_copies': book.num_copies,
                            'date_created': book.date_created,
                            'date_added': book.date_added
                        }

                    if sortby == "newest":
                        sorted_books = sorted(books_dict.items(), key=lambda item: item[1]['date_created'], reverse=True)
                    else:
                        sorted_books = sorted(books_dict.items(), key=lambda item: item[1]['date_created'])

                case "newlyAdded":
                    for book in books:
                        books_dict[book.date_added] = {
                            'isbn': book.isbn,
                            'title': book.title,
                            'genre': book.genre,
                            'literary_type': book.literary_type,
                            'author': book.author,
                            'num_copies': book.num_copies,
                            'date_created': book.date_created,
                            'date_added': book.date_added
                        }

                    sorted_books = sorted(books_dict.items(), key=lambda item: item[1]['date_added'], reverse=True)

            books = [book_data for _, book_data in sorted_books]

    return books

def read_books_all():
    with Session() as session:
        books = session.query(Book).all()

        session.close()

    books_dict = {}
    count = 0
    for book in books:
        books_dict[count] = {
            'isbn': book.isbn,
            'title': book.title,
            'genre': book.genre,
            'literary_type': book.literary_type,
            'author': book.author,
            'num_copies': book.num_copies,
            'date_created': book.date_created,
            'date_added': book.date_added
        }
        count += 1

    return books_dict