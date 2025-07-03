// src/App.jsx
import { Routes, Route } from "react-router-dom";

import PublicUrl from "./Public";
import PublicEmergencyContact from "./EmergencyContacts";
import EmergencyAlert from "./VerificationForm";

export default function App() {
  return (
    <Routes>
      <Route path="/public/alert" element={<EmergencyAlert />} />
      <Route path="/public-url/:id" element={<PublicUrl />} />
      <Route
        path="/public-emergency/:id/:contactName"
        element={<PublicEmergencyContact />}
      />
    </Routes>
  );
}
