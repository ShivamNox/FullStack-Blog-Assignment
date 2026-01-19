import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { usePost } from '../hooks/usePosts';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { post, loading, error } = usePost(id);
  const { user } = useAuth();

  const defaultImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200';

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
        <p className="text-gray-600 mb-6">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Go back home
        </button>
      </div>
    );
  }

  const isOwner = user && post.author?._id === user._id;

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Featured Image */}
      <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-8">
        <img
          src={post.imageURL || defaultImage}
          alt={post.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
      </div>

      {/* Meta information */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
        <span className="font-medium text-primary-600">@{post.username}</span>
        <span>•</span>
        <time dateTime={post.createdAt}>
          {format(new Date(post.createdAt), 'MMMM d, yyyy')}
        </time>
        {post.updatedAt !== post.createdAt && (
          <>
            <span>•</span>
            <span>Updated {format(new Date(post.updatedAt), 'MMM d, yyyy')}</span>
          </>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        {post.title}
      </h1>

      {/* Owner actions */}
      {isOwner && (
        <div className="flex gap-3 mb-8 p-4 bg-gray-50 rounded-lg">
          <Link to={`/edit/${post._id}`} className="btn-secondary flex-1">
            ✏️ Edit Post
          </Link>
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index} className="text-gray-700 leading-relaxed mb-4">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Share section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this post</h3>
        <div className="flex gap-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }}
            className="btn-secondary"
          >
            📋 Copy Link
          </button>
        </div>
      </div>
    </article>
  );
}