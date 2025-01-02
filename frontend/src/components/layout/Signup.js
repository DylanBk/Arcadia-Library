import React, { useState } from "react";

export default function Signup() {
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        'name': '',
        'email': '',
        'pw': ''
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        console.log(formData)

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            })
            .then((res) => res.json());

            if (response.message) {
                console.log('signup successful')
            } else {
                setError(response.error)
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
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    required={true}
                    onChange={handleInputChange}
                />
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
                    Sign Up
                </button>
            </form>
            <a
                className="w-fit p-2 rounded-md mx-auto mt-5 bg-[#1c1c1c] hover:bg-black text-white transition-colors duration-300"
                href="/login">
                I already have an account
            </a>
        </div>
    );
};