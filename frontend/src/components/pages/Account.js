import React, { useEffect, useState } from "react";

import Header from "../layout/Header";
import Footer from "../layout/Footer";

import placeholder from '../../assets/media/images/placeholder.png';


export default function Account() {
    const [userData, setUserData] = useState({});

    useEffect(() => {
        if (!document.cookie.split(";").some((item) => item.trim().startsWith("loggedIn=true"))) {
            window.location.href = '/';
        };

        const loadUserData = async () => {
            try {
                const response = await fetch('/account', {
                    method: 'GET'
                })
                .then((res) => res.json());

                if (response.message) {
                    console.log(response, response.message, response.data)
                    setUserData(response.data)
                } else {
                    console.log(response.error)
                }
            } catch (err) {
                console.error(err)
            };
        };
        loadUserData();
    }, []);

    return (
        <div>
            <Header />

            <div className="w-[95%] p-10 rounded-md mx-auto bg-grey">
                <div className="w-full flex flex-row">
                    <div className="w-1/3 flex flex-col gap-1 items-center border border-red-500">
                        <img
                            className="w-44 rounded-full"
                            src={placeholder}
                            alt="your profile pic"
                        />
                        <p>full name</p>
                        <p>email address</p>
                        <p>birthdate</p>
                        <p>joined dd-mm-yyyy</p>
                    </div>
                    <div className="border border-blue-500">
                        <form>
                            <input
                                name="name"
                                className="account-input-txt"
                                type="text"
                                placeholder="Full Name"
                                required={true}
                            />
                            <button className="!rounded-l-none btn-update">Update</button>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}