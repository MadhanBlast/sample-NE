 // 2 minutes in milliseconds
import React, { useState, useEffect } from "react";

export default function HomePage() {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showOverlay, setShowOverlay] = useState(true);

  const tokenExpiryTime = 2 * 60 * 1000; // 2 minutes in milliseconds

  // Function to handle verification
  const handleVerification = async () => {
    setLoading(true);
    setErrorMessage(""); // Clear previous errors

    const apiToken = "e5bf7301b4ad442d45481de99fd656a182ec6507";
    const callbackUrl = `${window.location.origin}/?verified=true`; // Return to the app with a "verified" flag
    const apiUrl = `https://api.gplinks.com/api?api=${apiToken}&url=${encodeURIComponent(callbackUrl)}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "success" && result.shortenedUrl) {
        // Open the verification link in a new tab
        window.open(result.shortenedUrl, "_blank");
      } else {
        throw new Error(result.message || "Failed to generate the verification link.");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      setErrorMessage(error.message || "An error occurred while contacting the server.");
    } finally {
      setLoading(false);
    }
  };

  // Check if the user is verified (token logic with expiry check)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isReturnedVerified = urlParams.get("verified") === "true";

    if (isReturnedVerified) {
      // Save token and timestamp to localStorage
      localStorage.setItem("gplinks_token", "valid");
      localStorage.setItem("gplinks_token_timestamp", Date.now().toString());
      setIsVerified(true);
      setShowOverlay(false);

      // Remove the "verified" parameter from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const token = localStorage.getItem("gplinks_token");
      const tokenTimestamp = localStorage.getItem("gplinks_token_timestamp");

      if (token && tokenTimestamp) {
        const elapsedTime = Date.now() - parseInt(tokenTimestamp);

        if (elapsedTime < tokenExpiryTime) {
          setIsVerified(true);
          setShowOverlay(false);
        } else {
          // Token expired, clear the token
          localStorage.removeItem("gplinks_token");
          localStorage.removeItem("gplinks_token_timestamp");
          setIsVerified(false);
          setShowOverlay(true);
        }
      }
    }
  }, []);

  // Render the overlay if not verified or token expired
  if (!isVerified && showOverlay) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <h1>Please verify your account to access the homepage</h1>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button
          onClick={handleVerification}
          disabled={loading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          {loading ? "Generating Verification Link..." : "Verify via GPLinks"}
        </button>
      </div>
    );
  }

  // Render the homepage if verified
  return (
    <div>
      <h1>Welcome to the Homepage!</h1>
      <p>You have successfully verified your account.</p>
    </div>
  );
}
