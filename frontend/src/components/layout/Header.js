import React, { useEffect, useState } from "react";

import libraryLogo from '../../assets/media/icons/arcadia-library.png';
import basket from '../../assets/media/icons/basket.svg';
import account from '../../assets/media/icons/account.svg';

export default function Header() {
    const [isScreenWide, setIsScreenWide] = useState(window.screen > 700)
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (document.cookie.split(";").some((item) => item.trim().startsWith("loggedIn=true"))) {
            setIsLoggedIn(true)
        };

        window.addEventListener('resize', handleResize());
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleResize = () => {
        setIsScreenWide(window.screen.width > 700);
    };


    const [isBurgermenuVisible, setIsBurgermenuVisible] = useState(false);

    const handleBurgermenu = () => {
        const line1 = document.getElementById('line1');
        const line2 = document.getElementById('line2');
        const line3 = document.getElementById('line3');

        if (isBurgermenuVisible) {
            document.body.style.overflowY = 'visible'; // resume scrolling

            line1.style.transform = 'translateY(0) rotate(0)';
            line3.style.transform = 'translateY(0) rotate(0)';
            line2.style.scale = 1;

            setIsBurgermenuVisible(false);
        } else {
            document.body.style.overflowY = 'hidden'; // stops user from scrolling

            if (line1.offsetWidth === 20) {
                line1.style.transform = 'translateY(0.5rem) rotate(45deg)';
                line3.style.transform = 'translateY(-0.5rem) rotate(-45deg)';
                line2.style.scale = 0;
            } else {
                line1.style.transform = 'translateY(0.75rem) rotate(45deg)';
                line3.style.transform = 'translateY(-0.75rem) rotate(-45deg)';
                line2.style.scale = 0;
            }

            setIsBurgermenuVisible(true);
        };
    };

    return (
                <div className="h-36 w-full relative flex flex-row gap-10 items-center text-nowrap">
                    <a className="w-fit" href="/">
                        <img
                            className="w-12 sm:w-14 md:w-16 lg:w-20 ml-5 smooth-change"
                            src={libraryLogo}
                            alt="Arcadia Library Logo"
                        />
                    </a>
                    <div className="h-36 w-full relative flex flex-row items-baseline">
                        <h1 className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl smooth-change">Arcadia Library</h1>
                        { isScreenWide ? (
                            <nav className="absolute right-10 top-1/2 flex flex-row gap-4 md:gap-5 lg:gap-10 items-center smooth-change">
                                <a className="primary-link" href="/about">About</a>
                                <a className="primary-link" href="/books">Books</a>
                                <a className="primary-link" href="/basket">
                                    <img
                                        className="icon"
                                        src={basket}
                                        alt="shopping basket icon"
                                    />
                                </a>
                                {isLoggedIn ? (
                                <a className="primary-link" href="/account">
                                    <img
                                            className="!w-7 icon"
                                            src={account}
                                            alt="user account icon"
                                        />
                                </a>
                                ) : (
                                    <a className="primary-link" href="/login">Login</a>
                                )}
                            </nav>
                        ) : (
                            <div>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 group flex flex-col gap-1.5 sm:gap-2 items-center mr-5 z-20" onClick={handleBurgermenu}>
                                    <div id="line1" className="h-0.5 xs:h-1 w-5 xs:w-8 rounded-full bg-white z-20 transition-all duration-300"></div>
                                    <div id="line2" className="h-0.5 xs:h-1 w-5 xs:w-8 rounded-full bg-white z-20 transition-all duration-300"></div>
                                    <div id="line3" className="h-0.5 xs:h-1 w-5 xs:w-8 rounded-full bg-white z-20 transition-all duration-300"></div>
                                </div>
                                { isBurgermenuVisible ? (
                                <div id="burgermenu" className="h-screen w-3/4 absolute right-0 top-0 z-10 bg-barossa">
                                    <nav className="flex flex-col gap-10 ml-2 sm:ml-4 mt-28 text-sm sm:text-lg">
                                        <a className="primary-link" href="/about">About</a>
                                        <a className="primary-link" href="/books">Books</a>
                                        <a className="flex flex-row gap-2 primary-link" href="/basket">
                                            <img
                                                className="!w-5 sm:!w-6 icon"
                                                src={basket}
                                                alt="shopping basket icon"
                                            />
                                            <p className="primary-link">My Shopping Basket</p>
                                        </a>
                                        <a className="flex flex-row gap-2 primary-link" href="/account">
                                            <img
                                                    className="!w-6 sm:!w-7 icon"
                                                    src={account}
                                                    alt="user account icon"
                                                />
                                                <p className="primary-link">My Account</p>
                                        </a>
                                    </nav>
                                </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                        )}
                    </div>
                </div>
    );
};