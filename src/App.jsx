import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Twitter, LogOut, User } from 'lucide-react';
import AuthForm from './components/AuthForm';
import TweetFeed from './components/TweetFeed';
import UserProfile from './components/UserProfile';
import { auth } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const isAuthenticated = !!localStorage.getItem('credentials');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    auth.logout();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 text-blue-500">
              <Twitter className="w-6 h-6" />
              <span className="font-bold text-xl">Twitter Clone</span>
            </Link>
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-gray-600 hover:text-blue-500">
                  <User className="w-5 h-5" />
                  <span>{user.userName}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-500">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-500 px-4 py-2 rounded-full border border-gray-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<TweetFeed />} />
          <Route path="/login" element={<AuthForm type="login" setUser={setUser} />} />
          <Route path="/register" element={<AuthForm type="register" />} />
          <Route path="/profile" element={<UserProfile user={user} />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
