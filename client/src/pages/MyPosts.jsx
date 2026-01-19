import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyPosts } from '../hooks/usePosts';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';

export default function MyPosts() {
  const navigate = useNavigate();
  const { posts, pagination, loading, refetch, deletePost } = useMyPosts();
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, post: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePageChange = useCallback((page) => {
    refetch({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [refetch]);

  const handleEdit = (post) => {
    navigate(`/edit/${post._id}`);
  };

  const handleDeleteClick = (post) => {
    setDeleteDialog({ isOpen: true, post });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.post) return;

    setIsDeleting(true);
    const success = await deletePost(deleteDialog.post._id);
    setIsDeleting(false);

    if (success) {
      setDeleteDialog({ isOpen: false, post: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, post: null });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
          <p className="text-gray-600 mt-1">
            {pagination?.totalPosts || 0} post{pagination?.totalPosts !== 1 ? 's' : ''} published
          </p>
        </div>
        <button
          onClick={() => navigate('/create')}
          className="btn-primary"
        >
          ✍️ New Post
        </button>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No posts yet"
          description="Start sharing your thoughts with the world!"
          actionText="Create Your First Post"
          actionLink="/create"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                showActions
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>

          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Post"
        message={`Are you sure you want to delete "${deleteDialog.post?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
}