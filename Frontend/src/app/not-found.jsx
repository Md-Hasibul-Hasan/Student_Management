export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-2 text-gray-500">
        Page not found

      </p>
      <div className="mt-4"></div>
        <a href="/" className="text-blue-500 hover:underline">
          Back to Home
        </a>
      </div>
    
  );
}