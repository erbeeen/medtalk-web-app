import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Not Found | MedTalk";
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light dark:bg-dark text-light-text dark:text-dark-text px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-primary dark:text-dark-primary mb-4">
            404
          </div>
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gray-300/80 dark:dark-secondary rounded-full"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-primary to-primary rounded-full flex items-center justify-center">
              <svg 
                className="w-16 h-16 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Oops! The page you're looking for seems to have wandered off into the digital void. 
          Don't worry, even the best medical professionals sometimes misplace things!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-primary hover:bg-primary/80 text-white font-medium rounded-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </button>
          <button
            onClick={handleGoBack}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Need help?</strong> If you believe this is an error, please contact our support team 
            or try refreshing the page.
          </p>
        </div>
      </div>
    </div>
  );
}
