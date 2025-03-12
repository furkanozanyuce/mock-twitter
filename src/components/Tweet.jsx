import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Repeat2, Trash2, Edit2 } from 'lucide-react';
import { tweets, likes, retweets, comments as commentAPI } from '../services/api';
import CommentForm from './CommentForm';
import RetweetForm from './RetweetForm';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Tweet({ tweet: initialTweet, onUpdate, isAuthenticated }) {
  const navigate = useNavigate();
  const [tweet, setTweet] = useState(initialTweet);
  const [liked, setLiked] = useState(tweet.isLiked);
  const [retweeted, setRetweeted] = useState(false);
  const [retweetId, setRetweetId] = useState(null);
  const [showRetweetForm, setShowRetweetForm] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [tweetComments, setTweetComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSentence, setEditedSentence] = useState(tweet.sentence);

  const fetchComments = async () => {
    try {
      const data = await commentAPI.getByTweetId(tweet.id);
      setTweetComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [tweet.id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      if (!liked) {
        await likes.like(tweet.id);
        setLiked(true);
        setTweet(prev => ({ ...prev, likesCount: prev.likesCount + 1 }));
      } else {
        await likes.unlike(tweet.id);
        setLiked(false);
        setTweet(prev => ({ ...prev, likesCount: prev.likesCount - 1 }));
      }
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleRetweetClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (retweeted) {
      handleUndoRetweet();
    } else {
      setShowRetweetForm(true);
    }
  };

  const handleUndoRetweet = async () => {
    try {
      if (retweetId) {
        await retweets.delete(retweetId);
        setRetweeted(false);
        setRetweetId(null);
        setTweet(prev => ({ ...prev, retweetsCount: prev.retweetsCount - 1 }));
        toast.success('Retweet removed');
      }
    } catch (error) {
      toast.error('Failed to remove retweet');
    }
  };

  const handleRetweetCreated = (data) => {
    setRetweeted(true);
    setRetweetId(data.id);
    setShowRetweetForm(false);
    setTweet(prev => ({ ...prev, retweetsCount: prev.retweetsCount + 1 }));
  };

  const handleEdit = async () => {
    try {
      await tweets.update(tweet.id, editedSentence);
      setIsEditing(false);
      setTweet(prev => ({ ...prev, sentence: editedSentence }));
      toast.success('Tweet updated');
    } catch (error) {
      toast.error('Failed to update tweet');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this tweet?')) {
      try {
        await tweets.delete(tweet.id);
        onUpdate(); // Only refresh on delete since we need to remove the tweet
        toast.success('Tweet deleted');
      } catch (error) {
        toast.error('Failed to delete tweet');
      }
    }
  };

  const handleCommentClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowCommentForm(!showCommentForm);
  };

  const handleCommentCreated = async () => {
    setShowCommentForm(false);
    await fetchComments();
    setTweet(prev => ({ ...prev, commentsCount: prev.commentsCount + 1 }));
  };

  const createdAt = tweet.createdAt ? new Date(tweet.createdAt) : null;
  const timeAgo = createdAt && !isNaN(createdAt.getTime())
    ? formatDistanceToNow(createdAt, { addSuffix: true })
    : '';

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            className="w-full p-2 border rounded-lg resize-none"
            value={editedSentence}
            onChange={(e) => setEditedSentence(e.target.value)}
            maxLength={280}
          />
          <div className="flex gap-2">
            <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{tweet.userName || `User #${tweet.userId}`}</p>
              <p className="text-gray-500 text-sm">
                {timeAgo}{timeAgo && ' ago'}
              </p>
            </div>
            {isAuthenticated && tweet.isOwner && (
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-blue-500">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={handleDelete} className="text-gray-500 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <p className="mt-2">{tweet.sentence}</p>
          <div className="flex gap-6 mt-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 ${liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
            >
              <Heart className="w-4 h-4" />
              <span>{tweet.likesCount}</span>
            </button>
            <button
              onClick={handleCommentClick}
              className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{tweet.commentsCount}</span>
            </button>
            <button
              onClick={handleRetweetClick}
              className={`flex items-center gap-1 ${retweeted ? 'text-green-500' : 'text-gray-500'} hover:text-green-500`}
            >
              <Repeat2 className="w-4 h-4" />
              <span>{tweet.retweetsCount}</span>
            </button>
          </div>
          {showRetweetForm && (
            <RetweetForm
              tweetId={tweet.id}
              onRetweetCreated={handleRetweetCreated}
              onCancel={() => setShowRetweetForm(false)}
            />
          )}
          {showCommentForm && (
            <CommentForm
              tweetId={tweet.id}
              onCommentCreated={handleCommentCreated}
            />
          )}
          {tweetComments.length > 0 && (
            <div className="mt-4 space-y-2 border-t pt-2">
              {tweetComments.map((c) => (
                <div key={c.commentId} className="text-sm text-gray-700">
                  <span className="font-medium">{c.userName || `User #${c.userId}`}: </span>
                  {c.sentence}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}