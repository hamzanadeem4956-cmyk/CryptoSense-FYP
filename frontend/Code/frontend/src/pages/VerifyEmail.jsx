import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/verify-email/${token}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Verification failed");
        }

        setMessage(data.message || "Email verified successfully.");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (err) {
        setError(err.message || "Something went wrong.");
        setMessage("");
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#050b16] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#07111f] border border-white/10 rounded-2xl p-8 text-center">
        <h1 className="text-white text-3xl font-bold mb-4">Email Verification</h1>
        {message && <p className="text-green-400">{message}</p>}
        {error && <p className="text-red-400">{error}</p>}
      </div>
    </div>
  );
}

export default VerifyEmail;