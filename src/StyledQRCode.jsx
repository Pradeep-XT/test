// src/components/StyledQRCode.jsx
// import { useEffect, useRef } from "react";
// import QRCodeStyling from "qr-code-styling";

// const StyledQRCode = ({ data = "https://example.com" }) => {
//   const ref = useRef(null);

//   const qrCode = new QRCodeStyling({
//     width: 120,
//     height: 120,
//     type: "svg",
//     data,
//     dotsOptions: {
//       color: "#2E63A5",
//       type: "lines",
//     },
//     cornersSquareOptions: {
//       color: "#AD60D8",
//       type: "extra-rounded",
//     },
//     backgroundOptions: {
//       color: "#ffffff",
//     },
//   });

//   useEffect(() => {
//     if (ref.current) {
//       qrCode.append(ref.current);
//     }
//   }, []);

//   return <div ref={ref} />;
// };

// export default StyledQRCode;


// src/components/StyledQRCode.jsx
import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import logo from '../public/logo.svg'

const qrCode = new QRCodeStyling({
  width: 120,
  height: 120,
  data: "logo.svg",
  image: `${logo}`, // You can add center logo if needed
  dotsOptions: {
    type: "rounded",
    color: "#2F59A7", // Blue
  },
  cornersSquareOptions: {
    type: "extra-rounded",
    color: "#2F59A7",
  },
  cornersDotOptions: {
    color: "#D26AD4", // Pink inside
  },
  backgroundOptions: {
    color: "#FFFDF7", // Background color
  },
});

const StyledQRCode = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) qrCode.append(ref.current);
  }, []);

  return <div ref={ref} />;
};

export default StyledQRCode;
