import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostForm from '../components/PostForm';
import Spinner from '../components/Spinner';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postsAPI.getOne(id);
        const fetchedPost = response.data.data.post;

        // Check if user is the owner
        if (fetchedPost.author._id !== user._id) {
          toast.error('You are not authorized to edit this post');
          navigate('/my-posts');
          return;
        }

        setPost(fetchedPost);
      } catch (error) {
        toast.error('Failed to load post');
        navigate('/my-posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user._id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      const response = await postsAPI.update(id, formData);
      toast.success('Post updated successfully!');
      navigate(`/posts/${response.data.data.post.slug || response.data.data.post._id}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update post';
      const details = error.response?.data?.details;

      if (details) {
        details.forEach((err) => toast.error(`${err.field}: ${err.message}`));
      } else {
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Post</h1>
      <p className="text-gray-600 mb-8">Update your post details</p>

      <div className="card p-6 md:p-8">
        <PostForm
          initialData={post}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          submitText="Update Post"
        />
      </div>
    </div>
  );
}