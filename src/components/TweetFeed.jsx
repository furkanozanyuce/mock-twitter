import React, { useEffect, useState } from 'react';
import { tweets } from '../services/api';
import Tweet from './Tweet';
import TweetForm from './TweetForm';
import toast from 'react-hot-toast';

export default function TweetFeed() {
  const [tweetList, setTweetList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const data = await tweets.getAll();
      
      // Safely handle the data without logging potentially uncloneable objects
      const tweetsArray = Array.isArray(data) ? data : data.tweets || [];
      const transformed = tweetsArray
        .map(t => {
          const tweetId = t.id !== undefined ? t.id : t.tweetId;
          if (tweetId === undefined) return null;
          
          return {
            ...t,
            id: Number(tweetId),
            user: t.user || { 
              id: t.userId || 'N/A', 
              userName: t.userName || `User #${t.userId || 'Unknown'}`
            },
          };
        })
        .filter(Boolean)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setTweetList(transformed);
    } catch (error) {
      toast.error('Failed to load tweets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {localStorage.getItem('credentials') && <TweetForm onTweetCreated={fetchTweets} />}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-600">Loading tweets...</div>
        ) : tweetList.length > 0 ? (
          tweetList.map((tweet) => (
            <Tweet 
              key={tweet.id} 
              tweet={tweet} 
              onUpdate={fetchTweets} 
              isAuthenticated={!!localStorage.getItem('credentials')} 
            />
          ))
        ) : (
          <div className="text-center text-gray-600">No tweets yet. Be the first to tweet!</div>
        )}
      </div>
    </div>
  );
}