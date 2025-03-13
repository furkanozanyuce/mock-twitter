import React, { useState } from 'react';
import { tweets } from '../services/api';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';

export default function TweetForm({ onTweetCreated }) {
  const [sentence, setSentence] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTweet = await tweets.create(sentence);
      setSentence('');
      // Pass the new tweet to parent component instead of triggering a refresh
      if (onTweetCreated) {
        onTweetCreated(newTweet);
      }
      toast.success('Tweet posted!');
    } catch (error) {
      toast.error('Failed to post tweet');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-4">
      <textarea
        className="w-full p-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={3}
        placeholder="What's happening?"
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
        maxLength={280}
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-500">{sentence.length}/280 characters</span>
        <button
          type="submit"
          disabled={!sentence.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Tweet
        </button>
      </div>
    </form>
  );
}