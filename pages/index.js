 // 2 minutes in milliseconds
import React, { useState, useEffect } from "react";

export default function HomePage() {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const tokenExpiryTime = 2 * 60 * 1000; // 2 minutes in milliseconds

  // Function to handle verification
  const handleVerification = async () => {
    setLoading(true);
    setErrorMessage(""); // Clear previous errors

    const apiToken = "e5bf7301b4ad442d45481de99fd656a182ec6507";
    const callbackUrl = "https://google.com"; // This can be your app's homepage URL, but we're not redirecting externally
    const apiUrl = `https://api.gplinks.com/api?api=${apiToken}&url=${encodeURIComponent(callbackUrl)}`;

    try {
      const response = await fetch(apiUrl);

      // Check if the response is okay
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();

      // Check the result status
      if (result.status === "success" && result.shortenedUrl) {
        // Save token and timestamp to localStorage
        localStorage.setItem("gplinks_token", "valid");
        localStorage.setItem("gplinks_token_timestamp", Date.now().toString());

        // Update the state to indicate successful verification
        setIsVerified(true);
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
    const token = localStorage.getItem("gplinks_token");
    const tokenTimestamp = localStorage.getItem("gplinks_token_timestamp");

    if (token && tokenTimestamp) {
      const elapsedTime = Date.now() - parseInt(tokenTimestamp);

      if (elapsedTime < tokenExpiryTime) {
        setIsVerified(true);
      } else {
        // Token expired, clear the token
        localStorage.removeItem("gplinks_token");
        localStorage.removeItem("gplinks_token_timestamp");
        setIsVerified(false);
      }
    }
  }, []);

  // Render the dialog if not verified or token expired
  if (!isVerified) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", textAlign: "center" }}>
        <h1>Please verify your account to access the homepage</h1>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button onClick={handleVerification} disabled={loading} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
          {loading ? "Verifying..." : "Verify via GPLinks"}
        </button>
      </div>
    );
  }

  // Render the homepage content if verified
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", textAlign: "center" }}>
      <h1>Welcome to the Homepage!</h1>
      <p>You have successfully verified your account.</p>
    </div>
  );
}
