// src/pages/PublicUrl.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  WhatsAppOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import { z } from "zod";
import api from "./api";
import TextArea from "antd/es/input/TextArea";

const relayCallSchema = z.object({
  emergencyContact: z
    .string()
    .min(10, "Emergency contact number is required")
    .regex(
      /^\+91\d{10}$/,
      "Emergency contact must be a valid Indian phone number with +91"
    ),
  victimPhone: z
    .string()
    .min(10, "Victim phone number is required")
    .regex(
      /^\+91\d{10}$/,
      "Victim phone must be a valid Indian phone number with +91"
    ),
});

export default function PublicUrl() {
  const { id } = useParams();
  sessionStorage.setItem("id", id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emergencyData, setEmergencyData] = useState(null);
  const [userId, setId] = useState(id);
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [location, setLocation] = useState(null); 

 
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.warn("❌ Geolocation error:", error.message);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.warn("Geolocation is not available in this browser.");
    }
  }, []);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("emergencyVerified");
    if (!sessionData) {
      navigate("/public/alert", { replace: true });
      return;
    }
  }, []);

  useEffect(() => {
    const storedId = sessionStorage.getItem("id");
    if (storedId) setId(storedId);
  }, []);

  useEffect(() => {
    const fetchEmergencyData = async () => {
      try {
        const response = await api.get(`/enduser/emergency/${userId}`);
        setEmergencyData(response.data?.data);
      } catch (err) {
        console.error("❌ Failed to fetch emergency data:", err);
        setError("Failed to load emergency data.");
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchEmergencyData();
  }, [userId]);

  const handleCall = (emergencyContact, contactName) => {
    const encodedName = encodeURIComponent(contactName);
    navigate(`/public-emergency/${userId}/${encodedName}`);
  };

  const handleAmbulanceCall = () => {
    window.location.href = `tel:108`;
  };

  async function submitWhatsappMessage() {
    try {
      if (!location) {
        alert("📍 Please wait, fetching your current location...");
        return;
      }

      const locationLink = `\n📍 Location: https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      const message = whatsappMessage.trim() + locationLink;

      console.log("📨 WhatsApp Message:", message); 

      const emergencyProfile = emergencyData.user.profiles.find(
        (p) => p.docs_name === "Emergency"
      );

      if (
        !emergencyProfile ||
        !Array.isArray(emergencyProfile.data?.emergency_contacts) ||
        emergencyProfile.data.emergency_contacts.length === 0
      ) {
        throw new Error("No emergency contact found.");
      }

      const sendMessages = emergencyProfile.data.emergency_contacts.map(
        async (contact) => {
          const emergencyMobile = "+91" + contact.emergency_contact;
          return api.post("/thirdpartyapi/sms/whatsapp", {
            message,
            to: emergencyMobile,
          });
        }
      );

      await Promise.all(sendMessages);

      alert("✅ WhatsApp message sent with current location!");
      setShowWhatsappModal(false);
      setWhatsappMessage("");
    } catch (error) {
      console.error("❌ Error sending WhatsApp message:", error.message);
      alert("Failed to send WhatsApp message.");
    }
  }

  async function submitSmsMessage() {
    try {
      if (!location) {
        alert("📍 Please wait, fetching your current location...");
        return;
      }

      const locationLink = `\n📍 Location: https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      const message = smsMessage.trim() + locationLink;

      console.log("📨 SMS Message:", message); 
      const sessionData = JSON.parse(
        sessionStorage.getItem("emergencyVerified")
      );
      const victimMobile = sessionData?.mobile;

      const emergencyProfile = emergencyData.user.profiles.find(
        (p) => p.docs_name === "Emergency"
      );

      if (
        !emergencyProfile ||
        !Array.isArray(emergencyProfile.data?.emergency_contacts) ||
        emergencyProfile.data.emergency_contacts.length === 0
      ) {
        throw new Error("No emergency contact found.");
      }

      const sendMessages = emergencyProfile.data.emergency_contacts.map(
        async (contact) => {
          const emergencyMobile = "+91" + contact.emergency_contact;
          return api.post("/thirdpartyapi/sms/send", {
            message,
            from: victimMobile,
            to: emergencyMobile,
          });
        }
      );

      await Promise.all(sendMessages);

      alert("✅ SMS message sent with current location!");
      setShowSmsModal(false);
      setSmsMessage("");
    } catch (error) {
      console.error("❌ Error sending SMS message:", error.message);
      alert("Failed to send SMS message.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-navy-700 rounded-full animate-spin"></div>
          <div className="text-lg font-medium text-navy-700">
            Loading emergency info...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200 max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-crimson-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-crimson-600">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-navy-800 mb-2">
              Unable to Load
            </h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const user = emergencyData?.user;
  const profile =
    user?.profiles?.find((p) => p.docs_name === "Profile")?.data || {};
  const rc =
    user?.profiles?.find((p) => p.docs_name === "RC")?.data?.data || {};
  const emergencyContacts =
    user?.profiles?.find((p) => p.docs_name === "Emergency")?.data
      ?.emergency_contacts || [];

  const name = user?.username || "Unknown";
  const blood = profile?.blood || "N/A";
  const city =
    profile?.address?.city || rc?.present_address?.split(",")[0] || "Unknown";
  const vehicle = rc?.rc_number
    ? rc.rc_number.slice(0, 6) + " ****"
    : "No Vehicle";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 relative overflow-hidden">
      <div className="absolute inset-0 opacity-15 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(31, 41, 55, 0.1) 2px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 py-4 px-4">
        <div className="max-w-md mx-auto space-y-2">
          {/* Title */}
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full border border-gray-200">
              <span className="text-sm font-medium text-navy-600">
                Emergency Contact Profile
              </span>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-6 w-full max-w-sm mx-auto">
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${name}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-navy-600 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="text-xs text-white font-bold">✓</span>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-navy-800">{name}</h2>
                </div>
                <p className="text-xs text-[#157347] font-medium border-b border-[#157347] w-fit">
                  Blood Group {blood}
                </p>
                <p className="text-md font-semibold text-gray-800">{vehicle}</p>
                <div className="flex items-center gap-1 text-sm text-navy-700 font-semibold">
                  <EnvironmentOutlined className="text-navy-600" />
                  <span>{city}</span>
                </div>
              </div>
            </div>

            {/* About */}
            <p className="mt-1 flex items-center gap-2 text-sm text-navy-600 font-medium underline underline-offset-4">
              <InfoCircleOutlined className="text-base" />
              <span>About {name}</span>
            </p>

            {/* Action Buttons */}
            <div className="mt-4 space-y-3">
              {/* Call */}
              {emergencyContacts.length > 0 && (
                <div
                  onClick={() =>
                    handleCall(
                      emergencyContacts[0].emergency_contact,
                      emergencyContacts[0].name
                    )
                  }
                  className="cursor-pointer flex items-center justify-between px-3 py-2 rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-white shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📞</span>
                    <span className="text-md text-gray-800 font-medium">
                      Call
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-green-600">
                      May Pickup
                    </span>
                    <span className="w-10 h-10 rounded-full border border-[#104935] flex items-center justify-center">
                      {/* Custom SVG */}
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        <g transform="rotate(45 50 50)">
                          <rect
                            x="40"
                            y="35"
                            width="20"
                            height="30"
                            rx="4"
                            fill="#104935"
                          />
                          <circle cx="50" cy="58" r="2" fill="#ffffff" />
                        </g>
                        <rect
                          x="28"
                          y="36"
                          width="6"
                          height="12"
                          rx="2"
                          transform="rotate(45 31 42)"
                          fill="#104935"
                        />
                        <rect
                          x="66"
                          y="54"
                          width="6"
                          height="12"
                          rx="2"
                          transform="rotate(45 69 60)"
                          fill="#104935"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              )}

              {/* WhatsApp */}
              {emergencyContacts.length > 0 && (
                <div
                  onClick={() => setShowWhatsappModal(true)}
                  className="cursor-pointer flex items-center justify-between px-3 py-2 rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      <WhatsAppOutlined />
                    </span>
                    <span className="text-md text-gray-800 font-medium">
                      WhatsApp
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-red-500">
                      Not Possible
                    </span>
                    <span className="w-10 h-10 rounded-full border border-[#104935] flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-[#104935]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <g transform="scale(0.85) translate(2, 2)">
                          <path
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14"
                            stroke="#104935"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M4 6l16 12"
                            stroke="#104935"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M4 6v12h12V6H4z"
                            stroke="#104935"
                            strokeWidth="1.5"
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>
              )}

              {/* SMS */}
              <div
                onClick={() => setShowSmsModal(true)}
                className="cursor-pointer flex items-center justify-between px-3 py-2 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">💬</span>
                  <span className="text-md text-gray-800 font-medium">
                    Message
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-blue-600">
                    Available anytime
                  </span>
                  <span className="w-10 h-10 rounded-full border border-[#104935] flex items-center justify-center bg-white">
                    <svg
                      className="w-8 h-8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#104935"
                      strokeWidth="1.5"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ambulance Section */}
          <div className="bg-gradient-to-br from-teal-100 to-white p-3 rounded-2xl shadow border border-teal-200">
            <h2 className="text-teal-800 text-lg font-semibold mb-1">
              🚑 Contact Ambulance
            </h2>
            <div
              onClick={() => handleAmbulanceCall("108")}
              className="cursor-pointer flex items-center justify-between px-4 py-3 rounded-2xl border border-red-300 bg-gradient-to-r from-white via-red-50 to-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">📞</span>
                <span className="text-md font-medium text-red-800">
                  Call 108
                </span>
              </div>
              <span className="text-sm font-semibold text-red-500">
                Govt. Emergency
              </span>
            </div>
          </div>

          {/* Problem Input */}
          <div className="bg-green-400 text-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Tell us your problem</h2>
            <p className="mb-4">
              By just typing it below, We will suggest the best solution for
              you.
            </p>
            <div className="flex items-center bg-green-300 p-2 rounded-md">
              <input
                type="text"
                placeholder="Type here..."
                className="flex-1 bg-transparent border-none text-white placeholder-white focus:outline-none"
              />
              <span className="ml-2 text-2xl">🔍</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-8">
            <span className="text-xs text-gray-500">Powered by XTown</span>
          </div>
        </div>
      </div>

      {/* WhatsApp Modal */}
      <Modal
        open={showWhatsappModal}
        onCancel={() => setShowWhatsappModal(false)}
        footer={null}
        centered
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 text-green-600 rounded-full p-2 text-xl">
              <WhatsAppOutlined />
            </div>
            <h2 className="text-lg font-semibold text-navy-800">
              Send WhatsApp Message
            </h2>
          </div>
          <TextArea
            value={whatsappMessage}
            onChange={(e) => setWhatsappMessage(e.target.value)}
            placeholder="Type your emergency WhatsApp message..."
            rows={4}
            className="rounded-xl border border-gray-300 focus:border-green-500 focus:ring-green-500 w-full"
          />
          <div className="flex justify-end pt-2">
            <button
              onClick={submitWhatsappMessage}
              className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold shadow transition flex items-center gap-2"
            >
              <WhatsAppOutlined />
              Send WhatsApp
            </button>
          </div>
        </div>
      </Modal>

      {/* SMS Modal */}
      <Modal
        open={showSmsModal}
        onCancel={() => setShowSmsModal(false)}
        footer={null}
        centered
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 rounded-full p-2 text-xl">
              💬
            </div>
            <h2 className="text-lg font-semibold text-navy-800">
              Send SMS Message
            </h2>
          </div>
          <TextArea
            value={smsMessage}
            onChange={(e) => setSmsMessage(e.target.value)}
            placeholder="Type your emergency SMS message..."
            rows={4}
            className="rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full"
          />
          <div className="flex justify-end pt-2">
            <button
              onClick={submitSmsMessage}
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow transition"
            >
              📩 Send SMS
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
