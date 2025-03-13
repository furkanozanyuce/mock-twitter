import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { tweets } from '../services/api';
import Tweet from './Tweet';

export default function UserProfile() {
  const [userTweets, setUserTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!localStorage.getItem('credentials');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    let mounted = true;

    const fetchUserTweets = async () => {
      if (user?.userId) {
        try {
          const data = await tweets.getByUserId(user.userId);
          if (!mounted) return;

          const tweetsArray = Array.isArray(data) ? data : [];
          const transformed = tweetsArray
            .map(t => ({
              ...t,
              id: t.id || t.tweetId,
              isOwner: true, // Since these are the user's own tweets
              createdAt: t.createdAt,
              userName: user.userName,
              userId: user.userId
            }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setUserTweets(transformed);
        } catch (error) {
          console.error('Failed to fetch user tweets:', error);
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }
    };

    fetchUserTweets();

    return () => {
      mounted = false;
    };
  }, [user]);

  const handleTweetUpdate = async () => {
    if (user?.userId) {
      setLoading(true);
      try {
        const data = await tweets.getByUserId(user.userId);
        const transformed = data.map(t => ({
          ...t,
          id: t.id || t.tweetId,
          isOwner: true,
          createdAt: t.createdAt,
          userName: user.userName,
          userId: user.userId
        }));
        setUserTweets(transformed);
      } catch (error) {
        console.error('Failed to update tweets:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold mb-2">{user.userName}'s Profile</h1>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-gray-500 mt-2">Total tweets: {userTweets.length}</p>
      </div>

      <h2 className="text-xl font-semibold mb-4">My Tweets</h2>
      {loading ? (
        <div className="text-center text-gray-600">Loading your tweets...</div>
      ) : userTweets.length > 0 ? (
        <div className="space-y-4">
          {userTweets.map((tweet) => (
            <Tweet 
              key={tweet.id} 
              tweet={tweet} 
              onUpdate={handleTweetUpdate}
              isAuthenticated={isAuthenticated} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 py-8">
          You haven't posted any tweets yet.
        </div>
      )}
    </div>
  );
}