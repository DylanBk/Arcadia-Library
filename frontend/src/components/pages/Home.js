import React from "react";

import Header from "../layout/Header";
import Footer from "../layout/Footer";

import heroBanner from '../../assets/media/images/hero-banner.webp';

export default function Home() {
    return (
        <div>
            <Header />

            <div className="h-80 md:h-96 w-full relative">
                <img
                    className="h-80 md:h-96 w-full object-cover bg-black opacity-80 smooth-change"
                    src={heroBanner}
                    alt="A desk with some books and a lamp on top of it inside an old but grand looking library"
                />
                <div className="w-3/4 sm:w-fit absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col p-5 rounded-sm bg-black bg-opacity-70 text-center text-wrap xs:text-nowrap smooth-change">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl smooth-change">Discover the World of Refined Knowledge</h2>
                    <p className="text-xs md:text-sm lg:text-base text-wrap md:text-nowrap smooth-change">Browse our curated collection in a space that exudes sophistication and timeless charm.</p>
                    <a className="w-fit mx-auto mt-8 special-btn" href="/books">Explore Our Library</a>
                </div>
            </div>

            <div className="flex flex-row justify-around py-10 bg-bg">
                <div className="w-[30%] lg:w-[15%] p-4 rounded-sm bg-grey">
                    <h3 className="text-2xl lg:text-4xl text-center">Quality</h3>
                    <hr></hr>
                    <p className="text-xs md:text-sm lg:text-base">We take pride in ensuring all provided books are in good condition.</p>
                </div>
                <div className="w-[30%] lg:w-[15%] p-4 rounded-sm bg-grey">
                    <h3 className="text-2xl lg:text-4xl text-center">We Care</h3>
                    <hr></hr>
                    <p className="text-xs md:text-sm lg:text-base">We always put our customers first and work to give them the best experience possible</p>
                </div>
                <div className="w-[30%] lg:w-[15%] p-4 rounded-sm bg-grey">
                    <h3 className="text-2xl lg:text-4xl text-center">Variety</h3>
                    <hr></hr>
                    <p className="text-xs md:text-sm lg:text-base">We provide a multitude of books from all types of genres.</p>
                </div>
            </div>

            <div className="bg-white">
                
            </div>

            <Footer />
        </div>
    );
};