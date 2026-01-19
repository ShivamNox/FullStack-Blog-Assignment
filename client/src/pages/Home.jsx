import { useState, useCallback } from 'react';
import { usePosts } from '../hooks/usePosts';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [searchParams, setSearchParams] = useState({ page: 1, search: '' });
  const { posts, pagination, loading, refetch } = usePosts();
  const { isAuthenticated } = useAuth();

  const handleSearch = useCallback((search) => {
    setSearchParams((prev) => ({ ...prev, search, page: 1 }));
    refetch({ search, page: 1 });
  }, [refetch]);

  const handlePageChange = useCallback((page) => {
    setSearchParams((prev) => ({ ...prev, page }));
    refetch({ ...searchParams, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [refetch, searchParams]);

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-primary-600">BlogApp</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover amazing stories, share your thoughts, and connect with writers from around the world.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by title or username..."
        />
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon="🔍"
          title={searchParams.search ? 'No posts found' : 'No posts yet'}
          description={
            searchParams.search
              ? 'Try adjusting your search terms'
              : 'Be the first to share your story!'
          }
          actionText={isAuthenticated ? 'Create Post' : 'Sign up to create'}
          actionLink={isAuthenticated ? '/create' : '/register'}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}