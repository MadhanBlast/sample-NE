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
    const apiUrl = `https://api.gplinks.com/api?api=${apiToken}&url=callback`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "success" && result.shortenedUrl) {
        // Simulate verification by fetching the shortened URL without opening a new tab
        const verificationResponse = await fetch(result.shortenedUrl);

        if (verificationResponse.ok) {
          // Simulate successful verification
          handleCloseOverlay();
        } else {
          throw new Error("Verification failed. Please try again.");
        }
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

  const handleCloseOverlay = () => {
    // Simulate successful verification without redirect
    localStorage.setItem("gplinks_token", "valid");
    localStorage.setItem("gplinks_token_timestamp", Date.now().toString());
    setIsVerified(true);
  };

  return (
    <div>
      {/* Overlay for verification */}
      {!isVerified && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            color: "white",
            textAlign: "center",
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
              margin: "10px 0",
            }}
          >
            {loading ? "Verifying..." : "Verify via GPLinks"}
          </button>
        </div>
      )}

      {/* Main Homepage Content */}
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Welcome to the Homepage!</h1>
        <p>You have successfully verified your account.</p>
      </div>
    </div>
  );
}
