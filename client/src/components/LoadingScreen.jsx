import Spinner from './Spinner';

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600 animate-pulse">{message}</p>
    </div>
  );
}