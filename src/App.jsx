import { Routes, Route } from "react-router-dom";

import PublicUrl from "./Public";
import PublicEmergencyContact from "./EmergencyContacts";
import EmergencyAlert from "./VerificationForm";

const App = () => {
  return (
    <Routes>
      <Route>
        <Route path="/public/alert" element={<EmergencyAlert />} />
        <Route
          path="/public-url/:id"
          element={
            // <RequireVerification>
            <PublicUrl />
            // </RequireVerification>
          }
        />
        <Route
          path="/public-emergency/:id/:contactName"
          element={
            // <RequireVerification>
            <PublicEmergencyContact />
            // </RequireVerification>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
