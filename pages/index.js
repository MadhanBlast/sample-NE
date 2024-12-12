import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [isVerified, setIsVerified] = useState(false); // State to track if the user is verified
  const [isLoading, setIsLoading] = useState(false);  // State for loading spinner
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  useEffect(() => {
    // Check if the token is valid (localStorage check)
    const token = localStorage.getItem('verificationToken');
    if (token && new Date().getTime() < JSON.parse(token).expiry) {
      setIsVerified(true);  // User is already verified
    } else {
      setIsVerified(false);  // User needs verification
    }
  }, []);

  const handleVerify = async () => {
    setIsLoading(true); // Set loading while generating verification URL
    const apiKey = "e5bf7301b4ad442d45481de99fd656a182ec6507"; // gplinks API Key
    const callbackUrl = `${window.location.origin}/?verified=true`; // Callback URL after verification

    try {
      // Make POST request to gplinks.in API
      const response = await fetch("https://gplinks.in/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api: apiKey,
          url: callbackUrl,
        }),
      });

      const data = await response.json();  // Parse the response

      // Check if API response is successful and contains shortened URL
      if (response.ok && data.status === "success" && data.shortenedUrl) {
        setIsLoading(false);  // Stop loading
        window.location.href = data.shortenedUrl;  // Redirect to the shortened URL (verification link)
      } else {
        setIsLoading(false);  // Stop loading
        setErrorMessage(`Failed to generate verification URL: ${data.message || 'Unknown error'}`); // Set error message
      }
    } catch (error) {
      setIsLoading(false);  // Stop loading
      setErrorMessage("An error occurred while trying to generate the verification URL. Please try again later."); // Set generic error message
    }
  };

  const handleTokenVerification = () => {
    // On successful verification, save token to localStorage with 24 hours expiry time
    const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours from now
    localStorage.setItem('verificationToken', JSON.stringify({ token: 'valid-token', expiry: expiryTime }));
    setIsVerified(true);
  };

  return (
    <div>
      {!isVerified ? (
        <div>
          <h1>Verification Required</h1>
          <p>Please verify your account to access the homepage.</p>

          {/* Show error message if there's any */}
          {errorMessage && <div className="error">{errorMessage}</div>}

          {/* Show a loading spinner while making the verification request */}
          {isLoading ? (
            <div className="spinner">Loading...</div>
          ) : (
            <button onClick={handleVerify}>Verify via GPLinks</button>
          )}
        </div>
      ) : (
        <div>
          <h1>Welcome to the Home Page!</h1>
          <p>You have successfully verified your account and can now access the content.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
