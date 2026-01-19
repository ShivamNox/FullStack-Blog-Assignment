import toast from 'react-hot-toast';

export default function ShareButtons({ title, url }) {
  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`
  };

  return (
    <div className="flex flex-wrap gap-2">
      {navigator.share && (
        <button
          onClick={handleNativeShare}
          className="btn-secondary text-sm"
        >
          📤 Share
        </button>
      )}

      <button
        onClick={handleCopyLink}
        className="btn-secondary text-sm"
      >
        📋 Copy Link
      </button>

      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary text-sm"
      >
        𝕏 Twitter
      </a>

      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary text-sm"
      >
        📘 Facebook
      </a>

      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary text-sm"
      >
        💼 LinkedIn
      </a>

      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary text-sm"
      >
        💬 WhatsApp
      </a>
    </div>
  );
}