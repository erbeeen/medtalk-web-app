import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function VerifyAccountRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, _setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Verify Account | MedTalk";

    const verifyAccountRequest = async () => {
      try {
        const userID = searchParams.get("id");

        if (!userID) {
          throw new Error("No user ID provided in the verification link.");
        }

        const res = await fetch(`/api/verify/?id=${userID}`, {
          mode: "cors",
          method: "GET",
        });
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Response from server has failed.");
        }

        setIsSuccess(true);
        // Redirect to account verified page after 2 seconds
        setTimeout(() => {
          navigate("/account-verified");
        }, 2000);

      } catch (err: any) {
        setError(err.message || "Failed to verify account. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    verifyAccountRequest();
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-light dark:bg-dark text-light-text dark:text-dark-text px-4">
        <div className="text-center max-w-md mx-auto">
          {/* Loading Animation */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <div className="spinner w-16 h-16 border-4 border-white border-l-transparent"></div>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Verifying Account
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Please wait while we verify your account. This may take a few moments...
          </p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
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

          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Verification Successful!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Your account has been verified successfully. Redirecting you to the verified page...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-light dark:bg-dark text-light-text dark:text-dark-text px-4">
        <div className="text-center max-w-md mx-auto">
          {/* Error Animation */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-pink-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
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
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Verification Failed
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {error}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
