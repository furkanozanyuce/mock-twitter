import React, { useState } from 'react';
import { comments } from '../services/api';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';

export default function CommentForm({ tweetId, onCommentCreated }) {
  const [sentence, setSentence] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await comments.create(tweetId, sentence);
      setSentence('');
      onCommentCreated();
      toast.success('Comment posted!');
    } catch (error) {
      toast.error('Failed to post comment');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Write a comment..."
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!sentence.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Reply
        </button>
      </div>
    </form>
  );
}
