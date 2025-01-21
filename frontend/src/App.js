import React, { useEffect } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import { extendCookie } from './utils/setCookie';

import Home from './components/pages/Home';
import Auth from './components/pages/Auth';
import Books from './components/pages/Books';
import Book from './components/pages/Book';
import Account from './components/pages/Account';

function App() {
  useEffect(() => {
    const handleUserActivity = () => {
      if (document.cookie.split(";").some((item) => item.trim().startsWith("loggedIn=true"))) { // check for cookie existence before extending it
        extendCookie('loggedIn', 'true', 600);
      };
    };

    const events = ['mosuemove', 'mousedown', 'click', 'scroll', 'keydown', 'touchstart', 'input'];
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity); // extends loggedIn cookie when user activity is detected
    });

    return () => { // stops multiple event listeners existing at same time, prevents memory leaks which are bad for performance
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/signup' element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/books" element={<Books />} />
        <Route path="book/*" element={<Book />} />
        <Route path='/account' element={<Account />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;