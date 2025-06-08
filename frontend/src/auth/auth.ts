import type { NavigateFunction, NavigateOptions, To } from "react-router-dom";

// WARN: THIS IS A TEMPORARY SOLUTION

export default async function automaticLogin(
  navigate: NavigateFunction,
  navigateTo: To,
  navigateOptions?: NavigateOptions,
) {
  try {
    if (window.location.pathname === "/login") {
      return;
    }
    console.log("calling automatic login");
    const response = await fetch("/api/users/admin/login", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    // const data = await response.json();
    console.log("response status code:", response.status);
    if (response.status === 200) {
      console.log("automatic login succeeded");
      if (navigateOptions !== undefined) {
        navigate(navigateTo, navigateOptions);
        return;
      } else {
        navigate(navigateTo);
        return;
      }
    }

    if (
      response.status == 400 ||
      response.status == 401 ||
      response.status == 403 ||
      response.status == 500
    ) {
      console.log("fetch to login failed with response 200");
      console.log("Trying to refresh token");

      const refreshTokenResponse = await fetch("/api/users/token", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const refreshStatus = refreshTokenResponse.status;
      console.log("fetch refresh token request status is ", refreshStatus);
      if (
        refreshStatus === 401 ||
        refreshStatus === 403 ||
        refreshStatus === 500
      ) {
        if (navigateOptions !== undefined) {
          navigate("/login", navigateOptions);
          return;
        } else {
          navigate("/login");
          return;
        }
      }
    }
  } catch (err) {
    console.error("error executing automatic login", err);
  }
}
