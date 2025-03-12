import React, { useState } from 'react';
import { retweets } from '../services/api';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';

export default function RetweetForm({ tweetId, onRetweetCreated, onCancel }) {
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the backend retweet endpoint with tweetId and optional message.
      const data = await retweets.create(tweetId, message);
      toast.success('Retweeted!');
      onRetweetCreated(data);
    } catch (error) {
      toast.error('Failed to retweet');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
      <input
        type="text"
        placeholder="Add a comment (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-3 py-2 rounded-full hover:bg-green-600 transition duration-200 flex items-center gap-1"
      >
        <Send className="w-4 h-4" />
        Retweet
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="bg-gray-300 text-gray-700 px-3 py-2 rounded-full hover:bg-gray-400 transition duration-200"
      >
        Cancel
      </button>
    </form>
  );
}
