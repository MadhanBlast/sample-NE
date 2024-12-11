// /components/NetworkError.js
import { useError } from "@/contexts/ErrorContext"; // Import useError to access error state

const NetworkError = () => {
  const { networkError } = useError(); // Get the network error state

  // If there's no error, do not render anything
  if (!networkError) return null;

  return (
    <div className="network-error-container">
      <div className="network-error">
        <span>{networkError}</span>
      </div>
    </div>
  );
};

export default NetworkError;
