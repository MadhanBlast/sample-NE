 // 2 minutes in milliseconds
import React, { useEffect, useState } from "react";

const API_TOKEN = "e5bf7301b4ad442d45481de99fd656a182ec6507"; // Replace with your actual API token
const VERIFY_EXPIRY_MINUTES = 2; // Set expiry time for testing (2 minutes for now)

const App = () => {
  const [isVerified, setIsVerified] = useState(false); // State for verification status
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading state

  useEffect(() => {
    // Check if token exists in localStorage and is valid
    const storedToken = localStorage.getItem("token");
    const storedExpiry = localStorage.getItem("tokenExpiry");

    if (storedToken && storedExpiry && new Date().getTime() < parseInt(storedExpiry, 10)) {
      setIsVerified(true); // Token is valid, so allow direct access
    }
  }, []);

  const handleVerification = async () => {
    setError(""); // Reset any previous error
    setLoading(true); // Start loading

    try {
      // Send request to GPLinks API
      const response = await fetch(
        `https://api.gplinks.com/api?api=${API_TOKEN}&url=https://yourwebsite.com`
      );
      const data = await response.json();

      // Validate API response
      if (data.status === "success" && data.shortenedUrl) {
        const token = data.shortenedUrl; // Use the returned shortened URL as the token
        const expiry = new Date().getTime() + VERIFY_EXPIRY_MINUTES * 60 * 1000; // Set expiry (e.g., 2 minutes)

        // Store the token and expiry in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("tokenExpiry", expiry.toString());

        // Revalidate by checking if token and expiry exist
        const storedToken = localStorage.getItem("token");
        const storedExpiry = localStorage.getItem("tokenExpiry");

        if (storedToken && storedExpiry && new Date().getTime() < parseInt(storedExpiry, 10)) {
          setIsVerified(true); // Verification successful
        } else {
          setError("Verification failed. Please try again.");
        }
      } else {
        setError("Verification failed. Please try again."); // Invalid response
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError("An error occurred while contacting the server. Please try again later.");
    } finally {
      setLoading(false); // End loading
    }
  };

  // Show the homepage content if the user is verified
  if (isVerified) {
    return (
      <div>
        <h1>Welcome to the Homepage!</h1>
        <p>You have successfully verified your account.</p>
        {/* Homepage content goes here */}
      </div>
    );
  }

  return (
    <div>
      <h1>Please verify your account to access the homepage.</h1>
      {loading ? (
        <p>Loading...</p> // Show loading state while verifying
      ) : (
        <button onClick={handleVerification}>Verify via GPLinks</button>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Show error message if any */}
    </div>
  );
};

export default App;
