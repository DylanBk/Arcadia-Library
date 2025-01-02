import React, { useState } from "react";

import {setCookie} from '../../utils/setCookie';

export default function Login() {
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        'email': '',
        'pw': ''
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
            const response = await fetch('/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            })
            .then((res) => res.json());

            if (response.message) {
                setCookie('loggedIn', 'true', 1800)
                window.location.href = '/';
            } else {
                setError(response.error);
            };
        } catch (err) {
            console.error(err);
        };
    };

    return (
        <div className="w-full relative flex flex-col items-center">
            <form
                className="w-1/2 flex flex-col gap-20 mx-auto mt-28"
                onSubmit={handleFormSubmit}>
                <p className="-mb-14 text-sm text-red-500 font-bold">{error}</p>
                <input
                    className="w-full auth-form-input"
                    name="email"
                    type="email"
                    placeholder="Email"
                    required={true}
                    onChange={handleInputChange}
                />
                <input
                    className="w-full auth-form-input"
                    name="pw"
                    type="password"
                    placeholder="Password"
                    required={true}
                    minLength={8}
                    onChange={handleInputChange}
                />
                <button
                    className="!w-3/4 rounded-lg mx-auto hover:!w-full primary-btn"
                    type="submit">
                    Login
                </button>
            </form>
            <a
                className="w-fit p-2 rounded-md mx-auto mt-5 bg-[#1c1c1c] hover:bg-black text-white transition-colors duration-300"
                href="/signup">
                Create Account
            </a>
        </div>
    )
}