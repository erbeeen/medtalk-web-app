import { useEffect } from "react";

export default function NotFoundRoute () {
  useEffect(() => {
    document.title = "Not Found | MedTalk"
  })
  return (
    <div className="h-full w-full flex flex-row justify-center items-center">
      <h1>404 Not Found</h1>
    </div>
  );
}
