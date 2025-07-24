// src/App.jsx
import { Routes, Route } from "react-router-dom";

import PublicUrl from "./Public";
import PublicEmergencyContact from "./EmergencyContacts";
import EmergencyAlert from "./VerificationForm";
import QREmergencyTag from './QREmergencyTag'
import TagQRDesign from './TagQRDesign.jsx'
import User from './User'
import PayoutStatus from "./PaymentText.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PayoutStatus />} />
      <Route path="/qr" element={<QREmergencyTag />} />
      <Route path="/public/alert" element={<EmergencyAlert />} />
      <Route path="/public-url/:id" element={<PublicUrl />} />
      <Route
        path="/public-emergency/:id/:contactName"
        element={<PublicEmergencyContact />}
      />
      <Route path="/qrcode" element= {
        <TagQRDesign qrData= "www.xtown.in"/>
      }/>   
      <Route path="/user/:id" element = {<User/>}/>
       </Routes>
  );
}
