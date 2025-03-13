import { Link } from '@tanstack/react-router';

function NotFound() {
  return (
    <>
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-9xl text-gray-400">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl text-white">Sorry, we couldn't find this page.</p>
          <p className="mt-4 mb-8 text-gray-600">
            But dont worry, you can find plenty of other things on our homepage.
          </p>
          <Link to="/" rel="noopener noreferrer"
                className="px-8 py-3 font-semibold rounded bg-gray-400 dark:text-gray-50">
            Back to homepage
          </Link>
        </div>
      </div>
    </>
  );
}

export default NotFound;
