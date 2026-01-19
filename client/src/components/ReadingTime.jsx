export default function ReadingTime({ content }) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return (
    <span className="text-gray-500 text-sm">
      {minutes} min read
    </span>
  );
}