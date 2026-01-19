import { useState, useEffect, useCallback } from 'react';
import { postsAPI } from '../services/api';
import toast from 'react-hot-toast';

export function usePosts(initialParams = {}) {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await postsAPI.getAll({ ...initialParams, ...params });
      setPosts(response.data.data.posts);
      setPagination(response.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, pagination, loading, error, refetch: fetchPosts };
}

export function useMyPosts() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await postsAPI.getMyPosts(params);
      setPosts(response.data.data.posts);
      setPagination(response.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
      toast.error('Failed to load your posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const deletePost = async (id) => {
    try {
      await postsAPI.delete(id);
      setPosts((prev) => prev.filter((post) => post._id !== id));
      toast.success('Post deleted successfully');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete post');
      return false;
    }
  };

  return { posts, pagination, loading, error, refetch: fetchPosts, deletePost };
}

export function usePost(id) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await postsAPI.getOne(id);
        setPost(response.data.data.post);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  return { post, loading, error };
}