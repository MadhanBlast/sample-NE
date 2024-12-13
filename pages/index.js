import { useState, useEffect } from "react";

export default function App() {
  const [tokenValid, setTokenValid] = useState(false); // State to track token validity
  const [loading, setLoading] = useState(true); // State to show loading spinner

  // Function to check token validity
  const checkToken = () => {
    const storedToken = localStorage.getItem("userToken");
    const storedExpiry = localStorage.getItem("tokenExpiry");

    if (storedToken && storedExpiry) {
      const currentTime = Date.now();
      if (currentTime < parseInt(storedExpiry)) {
        setTokenValid(true);
        setLoading(false);
        return;
      }
    }

    // Token expired or doesn't exist
    setTokenValid(false);
    setLoading(false);
  };

  // Function to handle verification
  const handleVerify = async () => {
    try {
      setLoading(true);

      const apiToken = "e5bf7301b4ad442d45481de99fd656a182ec6507";
      const apiUrl = `https://api.gplinks.com/api?api=${apiToken}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status === "success") {
        const expiryTime = Date.now() + 2 * 60 * 1000; // 2 minutes for testing
        localStorage.setItem("userToken", data.shortenedUrl);
        localStorage.setItem("tokenExpiry", expiryTime.toString());
        setTokenValid(true);
      } else {
        alert("Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  // Render loading spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render verification screen or homepage
  return (
    <div>
      {!tokenValid ? (
        <div>
          <h1>Please verify your account to access the homepage.</h1>
          <button onClick={handleVerify}>Verify via GPLinks</button>
        </div>
      ) : (
        <div>
          <h1>Welcome to the Homepage!</h1>
          <p>You have successfully verified your account.</p>
        </div>
      )}
    </div>
  );
}
