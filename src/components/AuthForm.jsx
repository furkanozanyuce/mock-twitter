import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/api';
import toast from 'react-hot-toast';
import { LogIn, UserPlus } from 'lucide-react';

export default function AuthForm({ type, setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    userName: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === 'register') {
        await auth.register(formData.email, formData.userName, formData.password);
        toast.success('Registration successful! Please log in.');
        navigate('/login');
      } else {
        const userData = await auth.login(formData.email, formData.password);
        localStorage.setItem('user', JSON.stringify(userData));
        if (setUser) setUser(userData);
        toast.success('Login successful!');
        navigate('/');
      }
    } catch (error) {
      toast.error('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          {type === 'login' ? (
            <>
              <LogIn className="w-6 h-6" />
              Login
            </>
          ) : (
            <>
              <UserPlus className="w-6 h-6" />
              Register
            </>
          )}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          {type === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            {type === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          {type === 'login' ? (
            <>
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:text-blue-600">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:text-blue-600">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
