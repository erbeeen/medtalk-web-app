import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

// TODO: Test out the functionality, create an appropriate design

export default function VerifyAccountRoute() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, _setSearchParams] = useSearchParams();

  useEffect(() => {
    document.title = "Verify Account | MedTalk";

    const verifyAccountRequest = async () => {
      try {
        const userID = searchParams.get("id");

        const res = await fetch(`/api/verify/?id=${userID}`, {
          mode: "cors",
          method: "GET",
        });
        const data = await res.json();

        if (!data.success) {
          throw new Error("Response from server has failed.");
        }
      } catch (err: any) {
        alert('Failed to verify account. Error: ${err}');
      } finally {
        setIsLoading(false);
      }
    }

    setIsLoading(true);
    verifyAccountRequest();

  }, [])

  return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        {!isLoading ?
          <div className="spinner"></div>
          :
          <h1>Account verification complete. You may now close this tab.</h1>
        }
      </div>
    </>
  );
}
