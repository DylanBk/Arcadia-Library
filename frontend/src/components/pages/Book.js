import React, { useEffect, useState } from "react";

import Header from "../layout/Header";
import Footer from "../layout/Footer";

export default function Book() {
    const [book, setBook] = useState(null);

    useEffect(() => {
        const getBook = async () => {
            try {
                const url = window.location.href.split('/');
                const isbn = url[4];
                const res = await fetch(`/book/${isbn}`, {
                    method: 'GET'
                })
                .then(res => res.json());
                console.log(res.data);
                setBook(res.data);
            } catch (err) {
                console.log(err);
            };
        };
        getBook();
    }, []);

    return (
        <div>
            <Header />

            <div className="flex flex-col bg-gray-600">
            {book ? (
                <div> {/** main book container */}
                    <img
                        className=""
                        src="#"
                        alt="#"
                    />
                    <p>{book.title}</p>
                    <p>{book.literary_type}, {book.genre}</p>
                    <p>{book.author}</p>
                    {/* <p>{book.</p> */}
                </div>
                ) : (
                    <></>
                )}
            </div>

            <Footer />
        </div>
    );
};