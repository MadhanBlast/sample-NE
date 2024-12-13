import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [isVerified, setIsVerified] = useState(false); // To check if the user is verified
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);

  // Handle the verification process
  const handleVerification = async () => {
    setLoading(true);
    setErrorMessage("");

    const apiToken = "e5bf7301b4ad442d45481de99fd656a182ec6507"; // Your API token
    const targetUrl = "https://google.com"; // The URL to be shortened via GPLinks
    const apiUrl = `https://api.gplinks.com/api?api=${apiToken}&url=${encodeURIComponent(targetUrl)}`;

    try {
      const response = await fetch(apiUrl);

      // If the response isn't okay, show an error
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "success" && result.shortenedUrl) {
        // Save the shortened URL and its expiration timestamp (24 hours)
        const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours from now
        localStorage.setItem("gplinks_token", result.shortenedUrl);
        localStorage.setItem("token_expiration", expirationTime.toString());

        // Redirect user to the shortened URL for verification
        window.location.href = result.shortenedUrl;
      } else {
        throw new Error("Failed to generate the verification link.");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setErrorMessage(error.message || "An error occurred during verification.");
    } finally {
      setLoading(false);
    }
  };

  // Check if the token is still valid
  useEffect(() => {
    const token = localStorage.getItem("gplinks_token");
    const expirationTime = localStorage.getItem("token_expiration");

    if (token && expirationTime) {
      const currentTime = new Date().getTime();

      // If the token is valid (within 24 hours)
      if (currentTime < expirationTime) {
        setIsTokenValid(true);
        setIsVerified(true); // User is verified
      } else {
        // Token has expired, so remove it
        localStorage.removeItem("gplinks_token");
        localStorage.removeItem("token_expiration");
        setIsVerified(false);
        setIsTokenValid(false);
      }
    }
  }, []);

  // If the user is not verified, show verification dialog
  if (!isVerified) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>Please verify your account to access the homepage</h1>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button
          onClick={handleVerification}
          disabled={loading}
          style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        >
          {loading ? "Verifying..." : "Verify via GPLinks"}
        </button>
      </div>
    );
  }

  // If the user is verified and token is valid, show the homepage and "Go to Homepage" button
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Welcome to the Homepage!</h1>
      <p>You have successfully verified your account.</p>

      {isTokenValid ? (
        <button
          onClick={() => window.location.href = "/home"} // Replace with actual homepage route
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginTop: "20px",
          }}
        >
          Go to Homepage
        </button>
      ) : (
        <p>Your verification has expired. Please verify again.</p>
      )}
    </div>
  );
};

export default HomePage;
