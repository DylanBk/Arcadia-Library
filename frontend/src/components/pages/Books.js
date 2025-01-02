import React, { useEffect, useState } from "react";

import Header from "../layout/Header";
import Footer from "../layout/Footer";

import searchIcon from '../../assets/media/icons/search.svg';
import placeholder from '../../assets/media/images/placeholder.png';
import dropdown from '../../assets/media/icons/dropwdown-def.svg';

export default function Books() {
    const [books, setBooks] = useState('')

    useEffect(() => {
        const getBooks = async () => {
            try {
                const response = await fetch('/books', {
                    method: 'GET'
                })
                .then((res) => res.json());

                if (response.message) {
                    const len = Object.keys(response.data).length;
                    let books = []
                    for (let i = 0; i < len; i++) {
                        books.push(response.data[i])
                    };

                    setBooks(books);
                } else {
                    console.log(response.error)
                };
            } catch (err) {
                console.error(err);
            };
        };
        getBooks()
    }, [])

    const [formData, setFormData] = useState({
        'title': ''
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/books/query', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            })
            .then((res) => res.json)();

            if (response.message) {
                console.log(response.data)
            } else {
                console.log(response.error)
            }
        } catch (err) {
            console.error(err)
        };
    };


    const [genres, setGenres] = useState({});
    const [litType, setLitType] = useState({});

    const handleGenreChange = (e) => {
        const {name, value} = e.target;

        if (name in genres) {
            delete genres[name]; // remove from genres if user unchecks box

            e.target.parentElement.classList.remove('filter-selected')
        } else {
            setGenres({
                ...genres,
                [name]: value
            });

            e.target.parentElement.classList.add('filter-selected')
        };
    };

    const handleLitTypeChange = (e) => {
        const {name, value} = e.target;

        if (name in litType) {
            delete litType[name];

            e.target.parentElement.classList.remove('filter-selected')
        } else {
            setLitType({
                ...litType,
                [name]: value
            });

            e.target.parentElement.classList.add('filter-selected');
        };
    };

    const handleGenreForm = async (e) => {
        e.preventDefault();

        const data = {
            'genres': genres,
            'literary_types': litType
        }

        try {
            const response = await fetch('/books/genres', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            .then((res) => res.json());

            if (response.message) {
                const booksArr = Object.values(response.data);

                setBooks(booksArr);
            } else {
                console.log(response.error)
            };
        } catch (err) {
            console.error(err)
        };
    };


    const [sortby, setSortby] = useState('');

    const handleSortbyChange = (e) => {
        const {value} = e.target;

        setSortby({
            'name': value
        });
    };

    const handleSortby = async (e) => {
        e.preventDefault();

        if (sortby === '') {
            return;
        };

        try {
            const response = await fetch('/books/sort', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(sortby)
            })
            .then((res) => res.json());

            if (response.message) {
                const len = Object.keys(response.data).length;
                let books = [];
                for (let i = 0; i < len; i++) {
                    books.push(response.data[i]);
                };

                setBooks(books);
            } else {
                console.log(response.error)
            };
        } catch (err) {
            console.error(err)
        };
    };


    const handleGenreDD = (e) => {
        const genres = document.getElementById('genres');

        if (e.target.classList.contains('rotated')) { // check if button is rotated and then run code based on state
            e.target.style.transition = 'transform 0.2s';
            e.target.style.transform = 'rotate(0deg)';
            e.target.classList.remove('rotated');

            const parentY = genres.getBoundingClientRect().top;

            Array.from(genres.children).forEach(child => { // for each child of #genres div, move to top of #genres by translating by difference between y coord of #genres and child
                let childY = child.getBoundingClientRect().top;
                let diff = parentY - childY;

                child.style.transition = 'transform 0.2s';
                child.style.transform = `translateY(${diff}px)`;
            });

            setTimeout(() => { // changing display breaks the animation so must be delayed
                genres.style.display = 'none';
            }, 100);
        } else {
            e.target.style.transition = 'transform 0.3s';
            e.target.style.transform = 'rotate(90deg)';
            e.target.classList.add('rotated');

            genres.style.display = 'flex';

            setTimeout(() => { // changing display breaks the animation so must be delayed
                Array.from(genres.children).forEach(child => { // resetting each child to translateY(0) sends them all back to inital position
                    child.style.transition = 'transform 0.2s';
                    child.style.transform = 'translateY(0)'
                });
            }, 0);
        };
    };

    const handleFilterScroll = (e) => {
        const x = e.target.scrollLeft;

        if (x < 357){ // scrollWidth (712) - offsetWidth (355) = 357
            document.getElementById('filter-grad-overlay').style.transform = `translateX(${x}px)`;
        }
    };

    return (
        <div>
            <Header />

            <form
                className="w-fit flex flex-row mx-auto"
                onSubmit={handleFormSubmit}>
                <input
                    name="title"
                    className="w-44 xs:w-[18rem] md:w-[30rem] lg:w-[40rem] px-4 py-3 sm:py-4 rounded-l-lg bg-grey text-white"
                    type="text"
                    placeholder="Search for a book..."
                    required={true}
                    onChange={handleInputChange}
                />
                <button
                    className="sm:!px-5 rounded-r-lg primary-btn"
                    type="submit">
                    <img
                        className="w-10"
                        src={searchIcon}
                        alt="Magnifying glass, click to search for your query"
                    />
                </button>
            </form>

            <div className="w-full flex flex-col xs:flex-row mt-5">
                <div className="h-fit xs:h-screen w-full xs:w-1/3 md:w-1/4 sticky top-0 flex flex-col bg-grey xs:overflow-y-hidden">
                    <div className="w-[90%] flex flex-col border-b-2 mx-auto pb-4 my-5 border-[#7f7f7f]">
                        <h3 className="hidden xs:block text-center">Genres</h3>
                        <form
                            className="flex flex-col text-[#afafaf] text-sm md:text-base text-nowrap"
                            onSubmit={handleGenreForm}>
                            <button
                                className="hidden xs:flex sm:hidden"
                                onClick={handleGenreDD}>
                                <img
                                    src={dropdown}
                                    alt="Dropdown arrow"
                                />
                            </button>

                            <div
                                id="genres"
                                className="w-full relative flex xs:hidden sm:flex flex-row xs:flex-wrap gap-2 sm:gap-4 xs:mb-5 overflow-x-scroll xs:overflow-x-auto"
                                onScroll={handleFilterScroll}>
                                <div
                                    id="filter-grad-overlay"
                                    className="h-[101%] w-[105%] absolute -left-1 xs:hidden bg-gradient-to-r from-grey from-0% via-transparent via-10% to-grey to-99% pointer-events-none">
                                </div>
                                <label className="flex flex-row filter">
                                    Action & Adventure
                                    <input
                                        name="Action & Adventure"
                                        value="Action & Adventure"
                                        className=""
                                        type="checkbox"
                                        onChange={handleGenreChange}
                                    />
                                </label>
                                <label className="flex flex-row filter">
                                    Comedy
                                    <input
                                        name="Comedy"
                                        value="Comedy"
                                        className=""
                                        type="checkbox"
                                        onChange={handleGenreChange}
                                    />
                                </label>
                                <label className="flex flex-row filter">
                                    Crime
                                    <input
                                        name="Crime"
                                        value="Crime"
                                        className=""
                                        type="checkbox"
                                        onChange={handleGenreChange}
                                    />
                                </label>
                                <label className="flex flex-row filter">
                                    Fantasy
                                    <input
                                        name="Fantasy"
                                        value="Fantasy"
                                        className=""
                                        type="checkbox"
                                        onChange={handleGenreChange}
                                    />
                                </label>
                                <label className="flex flex-row filter">
                                    History
                                    <input
                                        name="History"
                                        value="History"
                                        className=""
                                        type="checkbox"
                                        onChange={handleGenreChange}
                                    />
                                </label>
                                <label className="flex flex-row filter">
                                    Horror
                                    <input
                                        name="Horror"
                                        value="Horror"
                                        className=""
                                        type="checkbox"
                                        onChange={handleGenreChange}
                                    />
                                </label>
                                <label className="flex flex-row filter">
                                    Mystery
                                    <input
                                        name="Mystery"
                                        value="Mystery"
                                        className=""
                                        type="checkbox"
                                        onChange={handleGenreChange}
                                    />
                                </label>
                                <label className="flex flex-row filter">
                                    Romance
                                    <input
                                        name="Romance"
                                        value="Romance"
                                        className=""
                                        type="checkbox"
                                        onChange={handleGenreChange}
                                    />
                                </label>
                                <label className="flex flex-row filter">
                                    Sci-Fi
                                    <input
                                        name="Sci-Fi"
                                        value="Sci-Fi"
                                        className=""
                                        type="checkbox"
                                        onChange={handleGenreChange}
                                    />
                                </label>
                                <label className="flex flex-row filter">
                                    Superhero
                                    <input
                                        name="Superhero"
                                        value="Superhero"
                                        className=""
                                        type="checkbox"
                                        onChange={handleGenreChange}
                                    />
                                </label>
                            </div>

                            <hr className="hidden xs:flex"></hr>

                            <div id="lit-types" className="flex flex-row xs:flex-wrap gap-2 sm:gap-4 xs:mt-5 overflow-x-scroll xs:overflow-x-auto">
                                <label className="flex flex-row filter">
                                    Drama
                                    <input
                                        name="Drama"
                                        value="Drama"
                                        className=""
                                        type="checkbox"
                                        onChange={handleLitTypeChange}
                                    />
                                </label>
                                <label className="flex flex-row filter">
                                    Fiction
                                    <input
                                        name="Fiction"
                                        value="Fiction"
                                        className=""
                                        type="checkbox"
                                        onChange={handleLitTypeChange}
                                    />
                                </label>
                                <label className="flex flex-row filter">
                                    Non-Fiction
                                    <input
                                        name="Non-Fiction"
                                        value="Non-Fiction"
                                        className=""
                                        type="checkbox"
                                        onChange={handleLitTypeChange}
                                    />
                                </label>
                                <label className="flex flex-row filter">
                                    Poetry
                                    <input
                                        name="Poetry"
                                        value="Poetry"
                                        className=""
                                        type="checkbox"
                                        onChange={handleLitTypeChange}
                                    />
                                </label>
                            </div>
                            <button
                                className="mx-auto xs:mt-4 accent-btn"
                                type="submit">
                                Filter
                            </button>
                        </form>
                    </div>

                    <div className="w-[90%] flex flex-col xs:border-b-2 mx-auto pb-4 xs:my-5 border-[#7f7f7f]">
                        <h3 className="hidden xs:block text-center">Sort By</h3>
                        <form
                            className="flex flex-row xs:flex-col xs:gap-5 items-center text-[#afafaf] text-nowrap"
                            onSubmit={handleSortby}>
                            <select
                                className="border border-[#7f7f7f] rounded-lg xs:rounded-sm xs:mt-2 bg-grey"
                                onChange={handleSortbyChange}>
                                <option disabled={true} selected={true}> -- select an option -- </option>
                                <option value='a-z'>A-Z</option>
                                <option value='z-a'>Z-A</option>
                                <option value='newest'>Newest</option>
                                <option value='oldest'>Oldest</option>
                                <option value='newlyAdded'>Newly Added</option>
                            </select>
                            <button
                                className="mx-auto accent-btn"
                                type="submit">
                                Sort
                            </button>
                        </form>
                    </div>
                </div>

                <div className="w-3/4 bg-bg flex flex-col xs:flex-row flex-wrap gap-5 sm:items-start justify-center sm:justify-start place-self-center sm:place-self-start mt-10 xs:mt-0">
                    { books.length > 0 ? (
                        <>
                            {books.map((book) => {
                                return (
                                    <a
                                        key={book.isbn}
                                        className="h-fit max-w-[90%] sm:max-w-[40%] md:w-1/3 lg:w-1/4 flex flex-col p-4 rounded-lg mx-auto xs:mx-0 bg-[#cfcfcf] hover:scale-105 focus:scale-105 active:scale-105 smooth-change sm:first:ml-5"
                                        href="/book">
                                        <img
                                            className="rounded-sm mb-2"
                                            src={placeholder}
                                            alt="placeholder"
                                        />
                                        <p className="text-black font-bold">{book.title}</p>
                                        <p className="text-sm text-black">{book.author}</p>
                                        <p className="text-sm text-black italic">{book.genre}, {book.literary_type}</p>
                                        <p className="text-black">Available Copies: {book.num_copies}</p>
                                    </a>
                                )
                            })}
                        </>
                    ) : (
                        <div className="h-full w-full relative">
                                <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-white text-center animate-pulse">
                                    We're sorry but it seems like there are no books available.
                                </p>
                        </div>

                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}