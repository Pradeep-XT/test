// src/pages/PublicEmergencyContact.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api";
import { EnvironmentOutlined, InfoCircleOutlined } from "@ant-design/icons";

export default function PublicEmergencyContact() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [rc, setRc] = useState({});
  const [loading, setLoading] = useState(true);
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  useEffect(() => {
    if (!sessionStorage.getItem("emergencyVerified")) {
      navigate("/public/alert", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const victimData = sessionStorage.getItem("emergencyVerified");
    if (victimData) {
      try {
        const parsed = JSON.parse(victimData);
        setUser(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await api.get(`/enduser/emergency/${id}`);
        const userData = res.data?.data?.user;

        const profileData =
          userData?.profiles?.find((p) => p.docs_name === "Profile")?.data || {};
        const rcData =
          userData?.profiles?.find((p) => p.docs_name === "RC")?.data?.data || {};
        const contacts =
          userData?.profiles?.find((p) => p.docs_name === "Emergency")?.data?.emergency_contacts || [];

        setProfile(profileData);
        setRc(rcData);
        setEmergencyContacts(contacts);
      } catch {}
      setLoading(false);
    };
    fetchContact();
  }, [id]);

  const handleCall = async (number) => {
    try {
      const formattedNumber = `+91${number}`;
      const validatedData = {
        victimPhone: user?.mobile,
        emergencyContact: formattedNumber,
        name: user?.username || "Emergency User",
      };
      await api.post("/thirdpartyapi/call/relay", validatedData);
      alert("✅ Call initiated successfully!");
    } catch (err) {
      alert("❌ Failed to initiate call.");
    }
  };

  const handleAmbulanceCall = () => {
    window.location.href = `tel:108`;
  };

  const userName = user?.username || "User";
  const blood = profile?.blood || "N/A";
  const city = profile?.address?.city || rc?.present_address?.split(",")[0] || "Unknown";
  const vehicle = rc?.rc_number ? rc.rc_number.slice(0, 6) + " ****" : "No Vehicle";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-navy-700 rounded-full animate-spin"></div>
          <div className="text-lg font-medium text-navy-700">
            Loading contact info...
          </div>
        </div>
      </div>
    );
  }

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

      <div className="relative z-10 py-6 px-4">
        <div className="max-w-md mx-auto space-y-6">

          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full border border-gray-200">
              <span className="text-sm font-medium text-navy-600">Emergency Profile</span>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-6 w-full">
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${userName}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-navy-600 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="text-xs text-white font-bold">✓</span>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <h2 className="text-lg font-bold text-navy-800">{userName}</h2>
                <p className="text-xs text-[#157347] font-medium border-b border-[#157347] w-fit">Blood Group {blood}</p>
                <p className="text-md font-semibold text-gray-800">{vehicle}</p>
                <div className="flex items-center gap-1 text-sm text-navy-700 font-semibold">
                  <EnvironmentOutlined className="text-navy-600" />
                  <span>{city}</span>
                </div>
              </div>
            </div>

            {/* About */}
            <p className="mt-2 flex items-center gap-2 text-sm text-navy-600 font-medium underline underline-offset-4">
              <InfoCircleOutlined className="text-base" />
              <span>About {userName}</span>
            </p>

            {/* Emergency Contact Buttons */}
            <div className="mt-4 space-y-3">
              {emergencyContacts.length > 0 ? (
                emergencyContacts.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => handleCall(c.emergency_contact)}
                    className="cursor-pointer flex items-center justify-between px-4 py-3 rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-white shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📞</span>
                      <span className="text-md text-gray-800 font-medium">
                        Call {c.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-green-600">
                        May Pickup
                      </span>
                      <span className="w-10 h-10 rounded-full border border-[#104935] flex items-center justify-center">
                        <svg width="24" height="24" fill="none" stroke="#104935" strokeWidth="1.5">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-crimson-600 text-sm font-medium">
                  No emergency contacts found.
                </p>
              )}
            </div>
          </div>

          {/* Ambulance Call */}
          {/* <div className="bg-gradient-to-br from-red-100 to-white p-4 rounded-2xl shadow border border-red-200">
            <h2 className="text-red-800 text-md font-semibold mb-1">🚑 Contact Ambulance</h2>
            <div
              onClick={handleAmbulanceCall}
              className="cursor-pointer flex items-center justify-between px-4 py-3 rounded-2xl border border-red-300 bg-gradient-to-r from-white via-red-50 to-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">📞</span>
                <span className="text-md font-medium text-red-800">Call 108</span>
              </div>
              <span className="text-sm font-semibold text-red-500">Govt. Emergency</span>
            </div>
          </div> */}

          {/* Footer */}
          <div className="text-center pt-4">
            <span className="text-xs text-gray-500">Powered by XTown</span>
          </div>
        </div>
      </div>
    </div>
  );
}
