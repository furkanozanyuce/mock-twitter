import React, { useState } from 'react';
import { comments } from '../services/api';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Comment({ comment, onUpdate, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSentence, setEditedSentence] = useState(comment.sentence);

  const handleEdit = async () => {
    try {
      await comments.update(comment.commentId, editedSentence);
      setIsEditing(false);
      if (onUpdate) onUpdate();
      toast.success('Comment updated');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await comments.delete(comment.commentId);
        if (onUpdate) onUpdate();
        toast.success('Comment deleted');
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.error('Failed to delete comment');
      }
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={editedSentence}
          onChange={(e) => setEditedSentence(e.target.value)}
          className="flex-1 text-sm p-1 border rounded"
        />
        <button
          onClick={handleEdit}
          className="text-green-500 hover:text-green-600"
          title="Save"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="text-red-500 hover:text-red-600"
          title="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between group">
      <div className="text-sm text-gray-700">
        <span className="font-medium">{comment.userName}: </span>
        {comment.sentence}
      </div>
      {isOwner && (
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-blue-500"
            title="Edit comment"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-500 hover:text-red-500"
            title="Delete comment"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}