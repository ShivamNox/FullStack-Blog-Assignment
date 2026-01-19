import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { postsAPI } from '../services/api';
import PostForm from '../components/PostForm';

export default function CreatePost() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const response = await postsAPI.create(formData);
      toast.success('Post created successfully!');
      navigate(`/posts/${response.data.data.post.slug || response.data.data.post._id}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create post';
      const details = error.response?.data?.details;

      if (details) {
        details.forEach((err) => toast.error(`${err.field}: ${err.message}`));
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
      <p className="text-gray-600 mb-8">Share your thoughts with the world</p>

      <div className="card p-6 md:p-8">
        <PostForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitText="Publish Post"
        />
      </div>
    </div>
  );
}