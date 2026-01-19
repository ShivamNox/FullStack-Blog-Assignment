import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function PostCard({ post, showActions = false, onEdit, onDelete }) {
  const defaultImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800';

  return (
    <article className="card hover:shadow-md transition-shadow duration-200">
      <Link to={`/posts/${post.slug || post._id}`}>
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img
            src={post.imageURL || defaultImage}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span className="font-medium text-primary-600">@{post.username}</span>
          <span>•</span>
          <time dateTime={post.createdAt}>
            {format(new Date(post.createdAt), 'MMM d, yyyy')}
          </time>
        </div>

        <Link to={`/posts/${post.slug || post._id}`}>
          <h2 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 mb-2">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-600 line-clamp-3 text-sm">
          {post.content}
        </p>

        {showActions && (
          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => onEdit(post)}
              className="btn-secondary text-sm flex-1"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => onDelete(post)}
              className="btn-danger text-sm flex-1"
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}