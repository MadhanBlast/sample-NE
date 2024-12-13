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
    const callbackUrl = `${window.location.origin}/verified`; // Set a valid callback URL
    const apiUrl = `https://api.gplinks.com/api?api=${apiToken}&url=${encodeURIComponent(callbackUrl)}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "success" && result.shortenedUrl) {
        // Simulate verification directly using the shortened URL
        const verificationResponse = await fetch(result.shortenedUrl);

        if (verificationResponse.ok) {
          // Save token and timestamp to localStorage
          localStorage.setItem("gplinks_token", "valid");
          localStorage.setItem("gplinks_token_timestamp", Date.now().toString());
          setIsVerified(true);
          setShowOverlay(false);
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
        setShowOverlay(false);
      } else {
        // Token expired, clear the token
        localStorage.removeItem("gplinks_token");
        localStorage.removeItem("gplinks_token_timestamp");
        setIsVerified(false);
        setShowOverlay(true);
      }
    }
  }, []);

  return (
    <div>
      {showOverlay && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "#fff",
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
              backgroundColor: "#4caf50",
              border: "none",
              borderRadius: "5px",
              color: "#fff",
            }}
          >
            {loading ? "Verifying..." : "Verify via GPLinks"}
          </button>
        </div>
      )}

      {!showOverlay && (
        <div>
          <h1>Welcome to the Homepage!</h1>
          <p>You have successfully verified your account.</p>
        </div>
      )}
    </div>
  );
}
