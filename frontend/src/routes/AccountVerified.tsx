import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AccountVerifiedRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Account Verified | MedTalk";
  }, []);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const handleGoToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light dark:bg-dark text-light-text dark:text-dark-text px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <svg 
                className="w-16 h-16 text-white animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Account Verified!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Congratulations! Your account has been successfully verified. You can now access all features 
          of MedTalk and start managing your medical information securely.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoToLogin}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Sign In
          </button>
          <button
            onClick={handleGoToHome}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </button>
        </div>

        {/* Additional Information */}
        <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300">
            <strong>What's next?</strong> You can now log in to your account and start using MedTalk 
            to manage your medical schedules and information.
          </p>
        </div>
      </div>
    </div>
  );
}
