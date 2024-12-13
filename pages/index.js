import React, { useEffect, useState } from "react";

// Your API token for authentication (replace with your actual token)
const API_TOKEN = "e5bf7301b4ad442d45481de99fd656a182ec6507"; // Replace with your actual API token
const VERIFY_EXPIRY_MINUTES = 2; // Set expiry time for testing (2 minutes for now)

const App = () => {
  const [isVerified, setIsVerified] = useState(false); // State for verification status
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading state

  useEffect(() => {
    // Check if a token exists in localStorage and if it's still valid
    const storedToken = localStorage.getItem("token");
    const storedExpiry = localStorage.getItem("tokenExpiry");

    if (storedToken && storedExpiry && new Date().getTime() < parseInt(storedExpiry, 10)) {
      setIsVerified(true); // Token is valid, so allow direct access to homepage
    }
  }, []);

  const handleVerification = async () => {
    setLoading(true); // Start loading

    try {
      // Send request to GPLinks API to generate the ad URL
      const response = await fetch(
        `https://api.gplinks.com/api?api=${API_TOKEN}&url=https://google.com`
      );
      const data = await response.json();

      // Validate the API response
      if (data.status === "success" && data.shortenedUrl) {
        const token = data.shortenedUrl; // Get the shortened URL (token)
        const expiry = new Date().getTime() + VERIFY_EXPIRY_MINUTES * 60 * 1000; // Set expiry time

        // Store the token and expiry in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("tokenExpiry", expiry.toString());

        // Revalidate and check if the token and expiry exist
        const storedToken = localStorage.getItem("token");
        const storedExpiry = localStorage.getItem("tokenExpiry");

        if (storedToken && storedExpiry && new Date().getTime() < parseInt(storedExpiry, 10)) {
          setIsVerified(true); // Verification successful

          // Redirect to the generated GPLinks ad page
          window.location.href = data.shortenedUrl; // Redirect to the shortened ad URL
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

  // If user is verified, show homepage content
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
