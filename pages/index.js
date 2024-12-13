import React, { useState, useEffect } from "react";

export default function HomePage() {
  const [isVerified, setIsVerified] = useState(false);  // Default to false
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [checkedVerification, setCheckedVerification] = useState(false);  // Flag to check if verification was completed

  const tokenExpiryTime = 2 * 60 * 1000; // 2 minutes in milliseconds

  // Function to handle verification
  const handleVerification = async () => {
    setLoading(true);
    setErrorMessage(""); // Clear previous errors

    const apiToken = "e5bf7301b4ad442d45481de99fd656a182ec6507";
    const apiUrl = `https://api.gplinks.com/api?api=${apiToken}&url=${encodeURIComponent(window.location.origin)}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();

      // Check the result status
      if (result.status === "success" && result.shortenedUrl) {
        // Save token and timestamp to localStorage
        localStorage.setItem("gplinks_token", "valid");
        localStorage.setItem("gplinks_token_timestamp", Date.now().toString());

        // Mark user as verified after successful verification
        setIsVerified(true);
      } else {
        throw new Error(result.message || "Failed to verify.");
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

    // Checking token validity and expiry
    if (token && tokenTimestamp) {
      const elapsedTime = Date.now() - parseInt(tokenTimestamp);

      if (elapsedTime < tokenExpiryTime) {
        setIsVerified(true); // Set verified state if token is valid
      } else {
        // Token expired, clear the token
        localStorage.removeItem("gplinks_token");
        localStorage.removeItem("gplinks_token_timestamp");
      }
    }

    setCheckedVerification(true);  // Flag as completed after checking
  }, []);

  // If the verification check is still in progress
  if (!checkedVerification) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", textAlign: "center" }}>
        <h1>Loading verification status...</h1>
      </div>
    );
  }

  // Render the verification dialog if not verified or token expired
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

  // Render the homepage if verified
  return (
    <div>
      <h1>Welcome to the Homepge!</h1>
      <p>You have successfully verified your account.</p>
    </div>
  );
}
