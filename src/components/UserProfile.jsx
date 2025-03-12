import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { tweets } from '../services/api';
import Tweet from './Tweet';

export default function UserProfile({ user }) {
  const [userTweets, setUserTweets] = useState([]);
  const isAuthenticated = !!localStorage.getItem('credentials');

  useEffect(() => {
    const fetchUserTweets = async () => {
      if (user?.id) {
        try {
          const data = await tweets.getByUserId(user.id);
          const tweetsArray = Array.isArray(data) ? data : data.tweets || [];
          const transformed = tweetsArray
            .map((t, index) => {
              const tweetId = t.id !== undefined && t.id !== null ? t.id : (t.tweetId !== undefined && t.tweetId !== null ? t.tweetId : null);
              return {
                ...t,
                id: Number(tweetId),
                user: t.user || { 
                  id: t.userId !== undefined ? t.userId : 'N/A', 
                  userName: t.userName ? t.userName : (t.userId ? `User #${t.userId}` : 'Unknown User')
                },
              };
            })
            .filter((t) => t.id !== null)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setUserTweets(transformed);
        } catch (error) {
          console.error('Failed to fetch user tweets:', error);
        }
      }
    };

    fetchUserTweets();
  }, [user]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold mb-2">{user.userName}'s Profile</h1>
        <p className="text-gray-600">{user.email}</p>
      </div>

      <h2 className="text-xl font-semibold mb-4">My Tweets</h2>
      <div className="space-y-4">
        {userTweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} onUpdate={() => tweets.getByUserId(user.id).then(setUserTweets)} isAuthenticated={isAuthenticated} />
        ))}
      </div>
    </div>
  );
}
