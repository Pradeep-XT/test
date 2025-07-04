// src/pages/PublicEmergencyContact.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

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
    if (!victimData) return;

    try {
      const parsed = JSON.parse(victimData);
      setUser(parsed);
    } catch (error) {
      // silently fail
    }
  }, []);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await api.get(`/enduser/emergency/${id}`);
        const userData = res.data?.data?.user;

        const profileData =
          userData?.profiles?.find((p) => p.docs_name === "Profile")?.data ||
          {};
        const rcData =
          userData?.profiles?.find((p) => p.docs_name === "RC")?.data?.data ||
          {};
        const contacts =
          userData?.profiles?.find((p) => p.docs_name === "Emergency")?.data
            ?.emergency_contacts || [];

        setProfile(profileData);
        setRc(rcData);
        setEmergencyContacts(contacts);
      } catch (err) {
        // silently fail
      } finally {
        setLoading(false);
      }
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
      alert("Call initiated successfully!");
    } catch (err) {
      console.error(err);
      alert(
        "Failed to initiate call: " +
          (err.errors?.[0]?.message || "Invalid phone number")
      );
    }
  };

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

  const userName = user?.username || "User";
  const blood = profile?.blood || "N/A";
  const city = profile?.address?.city || rc?.present_address?.split(",")[0] || "Unknown";
  const vehicle = rc?.rc_number ? rc.rc_number.slice(0, 6) + " ****" : "No Vehicle";

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
      <div className="relative z-10 py-8 px-4">
        <div className="max-w-md mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-navy-800 mb-2 text-center">
            {userName}
          </h1>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-8">
            <div className="flex items-start gap-6">
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
              <div className="flex-1 space-y-3">
                <h2 className="text-xl font-bold text-navy-800 mb-1">
                  {userName}
                </h2>
                <p className="text-gray-500 text-sm font-medium">{vehicle}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-crimson-50 rounded-lg flex items-center justify-center">
                      <span className="text-crimson-600 text-sm">❤️</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium">
                        Blood Type
                      </p>
                      <p className="text-navy-800 font-semibold">{blood}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                      <span className="text-navy-600 text-sm">📍</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium">
                        Location
                      </p>
                      <p className="text-navy-800 font-semibold">{city}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 font-medium">
                Emergency Contacts for {userName}
              </p>
              <div className="mt-4 space-y-3">
                {emergencyContacts.length > 0 ? (
                  emergencyContacts.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => handleCall(c.emergency_contact)}
                      className="w-full px-4 py-3 text-left bg-blue-100 hover:bg-blue-200 text-navy-800 font-semibold rounded-xl shadow-sm transition"
                    >
                      {c.name}
                    </button>
                  ))
                ) : (
                  <p className="text-crimson-600 text-sm font-medium">
                    No emergency contacts found.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="text-center pt-8">
            <span className="text-xs text-gray-500">Powered by XTown</span>
          </div>
        </div>
      </div>
    </div>
  );
}