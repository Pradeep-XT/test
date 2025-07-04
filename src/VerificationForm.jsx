import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import CryptoJS from "crypto-js";

const ENCRYPTION_SECRET = "12345678901234567890123456789012";

function decryptOtp(encryptedOtp) {
  try {
    const [ivHex, encryptedHex] = encryptedOtp.split(":");
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const encrypted = CryptoJS.enc.Hex.parse(encryptedHex);

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encrypted },
      CryptoJS.enc.Utf8.parse(ENCRYPTION_SECRET),
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption error", error);
    return null;
  }
}

export default function EmergencyAlert() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("+91");
  const [otp, setOtp] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [encryptedOtp, setEncryptedOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpEnabled, setOtpEnabled] = useState(false);

  const [userId, setId] = useState(null);

  useEffect(() => {
    const storedId = sessionStorage.getItem("id");
    if (storedId) {
      setId(storedId);
    }
  }, []);

  const handleMobileChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith("+91")) {
      value = "+91" + value.replace(/\D/g, "").slice(-10);
    }
    setMobile(value);
  };

  const handleSendOtp = async () => {
    setError("");
    if (!mobile.match(/^\+91\d{10}$/)) {
      setError("Please enter a valid +91 mobile number");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/thirdpartyapi/otp/send", {
        to: mobile,
        message: "Your OTP will be sent securely",
      });

      if (response?.data?.success && response.data.encryptedOtp) {
        setEncryptedOtp(response.data.encryptedOtp);
        setOtpEnabled(true);
        alert("✅ OTP sent successfully!");
      } else {
        throw new Error(response?.data?.message || "SMS API failed");
      }
    } catch (err) {
      console.error("OTP send error:", err);
      setError("❌ Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    try {
      console.log("encrypted:", otp);
      const realOtp = decryptOtp(encryptedOtp);
      console.log("real otp:", realOtp);
      if (!realOtp || realOtp !== otp) {
        throw new Error("OTP mismatch");
      }

      sessionStorage.setItem(
        "emergencyVerified",
        JSON.stringify({
          name,
          mobile,
          city,
          expiresAt: Date.now() + 5 * 60 * 1000,
        })
      );
      navigate(`/pulic-url/${userId}`, { replace: true });
    } catch (err) {
      console.error(err);
      setError("OTP verification failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg space-y-4 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center">Verify to Continue</h2>
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Mobile (+91…)</label>
          <input
            type="tel"
            value={mobile}
            onChange={handleMobileChange}
            required
            className="mt-1 w-full border rounded-lg p-2"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleSendOtp}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium">OTP</label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            disabled={!otpEnabled}
            className={`mt-1 w-full border rounded-lg p-2 ${
              !otpEnabled ? "bg-gray-200 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="mt-1 w-full border rounded-lg p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold"
        >
          Verify & Continue
        </button>
      </form>
    </div>
  );
}
