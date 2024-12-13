import React, { useState, useEffect } from "react";

export default function HomePage() {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Function to handle verification
  const handleVerification = async () => {
    setLoading(true);
    setErrorMessage(""); // Clear previous errors

    const apiToken = "e5bf7301b4ad442d45481de99fd656a182ec6507";
    const callbackUrl = "https://google.com"; // Replace with your actual callback URL
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
        // Redirect the user to the shortened URL
        window.location.href = result.shortenedUrl;
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

  // Check if the user is verified (token logic can be added here)
  useEffect(() => {
    const token = localStorage.getItem("gplinks_token");
    if (token) {
      setIsVerified(true);
    }
  }, []);

  // Render the dialog if not verified
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
      <h1>Welcome to the Homepage!</h1>
      <p>You have successfully verified your account.</p>
    </div>
  );
}
