import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mt-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mt-2">
          Oops! The page you are looking for doesn’t exist.
        </p>
        <div
          onClick={() => navigate(-1)}
          className="inline-flex items-center mt-6 px-4 py-2 text-white bg-primary rounded-md text-lg font-medium transition duration-200 ease-in-out cursor-pointer"
        >
          Go Back
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
