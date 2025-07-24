// Example React polling logic
import { useEffect, useState } from "react";
import axios from "axios";

export default function PayoutStatus({ txnId }) {
  const [status, setStatus] = useState("PENDING");

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await axios.get(`/api/v1/payout/status/${txnId}`);
      setStatus(res.data.status);
    }, 5000);

    return () => clearInterval(interval);
  }, [txnId]);

  return <div>Payout Status: {status}</div>;
}
