import React, { useState, useEffect } from "react";

function App() {
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Check token on component load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("expiry");

    if (token && expiry && Date.now() < Number(expiry)) {
      setIsVerified(true); // Token is valid
    } else {
      setIsVerified(false); // Token is expired or not available
    }
  }, []);

  // Function to handle verification
  const handleVerification = async () => {
    const apiToken = "e5bf7301b4ad442d45481de99fd656a182ec6507"; // Replace with your API Token
    const apiUrl = `https://api.gplinks.com/api?api=${apiToken}&url=https://google.com`;

    try {
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (result.status === "success") {
        // Save token and expiry in localStorage
        localStorage.setItem("token", result.shortenedUrl);
        localStorage.setItem("expiry", Date.now() + 2 * 60 * 1000); // 2 minutes expiry for testing
        setIsVerified(true); // Mark as verified
      } else {
        throw new Error(result.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      {isVerified ? (
        <div>
          <h1>Welcome to the Homepage!</h1>
          <p>You have successfully verified your account.</p>
        </div>
      ) : (
        <div>
          <h1>Verification Required</h1>
          <p>Please verify your account to access the homepage.</p>
          <button onClick={handleVerification}>Verify</button>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
      )}
    </div>
  );
}

export default App;
