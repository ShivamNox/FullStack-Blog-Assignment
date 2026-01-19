import { Link } from 'react-router-dom';

export default function EmptyState({
  icon = '📝',
  title = 'No posts yet',
  description = 'Be the first to create a post!',
  actionText,
  actionLink
}) {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn-primary">
          {actionText}
        </Link>
      )}
    </div>
  );
}