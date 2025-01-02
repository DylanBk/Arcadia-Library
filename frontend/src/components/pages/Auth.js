import React, { useEffect, useState } from "react";

import Header from "../layout/Header";
import Login from "../layout/Login";
import Signup from '../layout/Signup';
import Footer from '../layout/Footer'

import libraryImage from '../../assets/media/images/auth-page-library.jpeg';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        if (document.cookie.split(";").some((item) => item.trim().startsWith("loggedIn=true"))) {
            window.location.href = '/';
        };
        if (window.location.href.includes('login')) {
            setIsLogin(true);
        };
    }, []);

    return (
        <div>
            <Header />

            <div className="h-fit w-full flex flex-row">
                <div className="w-1/2 bg-white">
                    { isLogin ? (
                        <Login />
                    ) : (
                        <Signup />
                    )}
                </div>

                <img
                    className="max-h-[100vh] w-1/2 object-cover"
                    src={libraryImage}
                    alt="A tall library room with shelves going up to the ceiling and armchairs and sofas with round tables"
                />
            </div>

            <Footer />
        </div>
    );
};