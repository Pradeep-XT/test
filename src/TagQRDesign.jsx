// import { useEffect, useRef } from "react";
// import QRCodeStyling from "qr-code-styling";
// import logo from "../public/logo.svg";
// import companyLogo from "./assets/company_logo.png";

// const TagQRDesign = (qrData = "www.xtown.in") => {
//   const ref = useRef(null);

//   const qrCode = new QRCodeStyling({
//     width: 120,
//     height: 120,
//     data: qrData, // Update to your actual QR URL
//     // image: `${logo}`,
//     dotsOptions: {
//       type: "rounded",
//       color: "#2F59A7",
//     },
//     cornersSquareOptions: {
//       type: "extra-rounded",
//       color: "#2F59A7",
//     },
//     cornersDotOptions: {
//       color: "#D26AD4",
//     },
//     backgroundOptions: {
//       color: "#FFFDF7",
//     },
//     imageOptions: {
//       crossOrigin: "anonymous",
//       margin: 5,
//     },
//   });

//   useEffect(() => {
//     if (ref.current) {
//       ref.current.innerHTML = ""; // Clear previous
//       qrCode.append(ref.current);
//     }
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-[#fffdf7] p-4">
//       <div className="relative w-[250px] h-[250px] flex items-center justify-center">
//         {/* Top Label */}
//         <div className="bg-[#2F59A7] text-white px-6 py-2 rounded-full text-lg font-semibold absolute top-0">
//           TagQQ
//         </div>

//         {/* QR Code in Center */}
//         <div className="absolute w-full h-full flex items-center justify-center -top-5">
//           <div ref={ref} />
//         </div>

//         {/* Circular Text SVG */}
//         <svg viewBox="0 0 350 350" className="absolute w-full h-full rotate-[125deg]">
//           <path
//             id="circlePath"
//             d="M 175, 175 m -150, 0 a 150,150 0 1,1 300,0 a 150,150 0 1,1 -300,0"
//             fill="none"
//           />
//           <text fill="#2F59A7" fontSize="30" className="font-bold" fontFamily="sans-serif">
//             <textPath href="#circlePath" startOffset="0%">
//               THE POWER OF EVERY TAG · EMERGENCY SCAN ID
//             </textPath>
//           </text>
//         </svg>

//         {/* Bottom Powered By Label and Logo */}
//         <div className="mt-4 text-center text-sm">
//           <div className="bg-[#2F59A7] text-white px-3 py-0.5 rounded-full inline-block text-[6px] absolute bottom-14 left-24">
//             Powered by
//           </div>
//           <img
//             src={companyLogo}
//             alt="Logo"
//             className="absolute bottom-10 left-28"
//             width={35}
//             height={20}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TagQRDesign;



// import { useEffect, useRef } from "react";
// import QRCodeStyling from "qr-code-styling";
// import logo from "../public/logo.svg";
// import companyLogo from "./assets/company_logo.png";

// const TagQRDesign = ({ qrData = "https://www.xtown.in" }) => {
//   const ref = useRef(null);

//   const qrCode = new QRCodeStyling({
//     width: 150,
//     height: 150,
//     data: qrData,
//     // image: logo,
//     dotsOptions: {
//       type: "",
//       color: "royalblue", // Black ensures better contrast
//     },
//     cornersSquareOptions: {
//       type: "extra-rounded",
//       color: "purple",
//     },
//     backgroundOptions: {
//       color: "#ffffff", // Plain white background
//     },
//     imageOptions: {
//       crossOrigin: "anonymous",
//       margin: 10, // Ensures QR structure isn't blocked
//       imageSize: 0.2, // Make logo smaller relative to QR
//     },
//   });

//   useEffect(() => {
//     if (ref.current) {
//       ref.current.innerHTML = "";
//       qrCode.append(ref.current);
//     }
//   }, [qrData]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-[#fffdf7] p-4">
//       <div className="relative w-[300px] h-[300px] flex items-center justify-center">
//         <div className="bg-[#2F59A7] text-white px-6 py-2 rounded-full text-lg font-semibold absolute top-0">
//           TagQQ
//         </div>

//         {/* QR Code Center */}
//         <div className="absolute w-full h-full flex items-center justify-center -top-5">
//           <div ref={ref} />
//         </div>

//         {/* Circular SVG Text */}
//         <svg viewBox="0 0 350 350" className="absolute w-full h-full rotate-[125deg]">
//           <path
//             id="circlePath"
//             d="M 175, 175 m -150, 0 a 150,150 0 1,1 300,0 a 150,150 0 1,1 -300,0"
//             fill="none"
//           />
//           <text fill="#2F59A7" fontSize="30" fontWeight="bold" fontFamily="sans-serif">
//             <textPath href="#circlePath">
//               THE POWER OF EVERY TAG · EMERGENCY SCAN ID
//             </textPath>
//           </text>
//         </svg>

//         {/* Bottom Label */}
//         <div className="mt-4 text-center text-sm">
//           <div className="bg-[#2F59A7] text-white px-3 py-0.5 rounded-full inline-block text-[8px] absolute bottom-14 left-28">
//             Powered by
//           </div>
//           <img
//             src={companyLogo}
//             alt="Logo"
//             className="absolute bottom-10 left-32"
//             width={30}
//             height={20}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TagQRDesign;


import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import logo from "../public/logo.svg";
import companyLogo from "./assets/company_logo.png";

const TagQRDesign = ({ qrData = "https://www.xtown.in" }) => {
  const ref = useRef(null);

  const qrCode = new QRCodeStyling({
    width: 150,
    height: 150,
    data: qrData,
    // image: logo,
    dotsOptions: {
      type: "rounded",
      color: "#1E3A8A", // Deep blue for better contrast
      gradient: {
        type: "linear",
        rotation: 0,
        colorStops: [
          { offset: 0, color: "#1E3A8A" },
          { offset: 1, color: "#3B82F6" },
        ],
      },
    },
    cornersSquareOptions: {
      type: "extra-rounded",
      color: "#7C3AED", // Vibrant purple
      gradient: {
        type: "linear",
        rotation: 0,
        colorStops: [
          { offset: 0, color: "#7C3AED" },
          { offset: 1, color: "#3B82F6" },
        ],
      },
    },
    backgroundOptions: {
      color: "transparent", // Transparent to blend with card
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 8,
      imageSize: 0.25,
    },
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = "";
      qrCode.append(ref.current);
    }
  }, [qrData]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#F5F3FF] to-[#E0E7FF] p-4">
      <div className="relative w-[300px] h-[300px] flex items-center justify-center">
        {/* Card Container with Shadow and Hover Effect */}
        <div className="absolute w-[280px] h-[280px] bg-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl border border-gray-100">
          {/* Top Label */}
          <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white px-2 rounded-full text-lg font-semibold tracking-tight text-s! shadow-md transition-all duration-300 hover:scale-105 z-9999">
            TagQQ
          </div>

          {/* QR Code Center */}
          <div className="absolute w-full h-full flex items-center justify-center -top-5">
            <div ref={ref} className="p-4 bg-white rounded-lg shadow-inner" />
          </div>

          {/* Circular SVG Text */}
          <svg viewBox="0 0 350 350" className="absolute w-full h-full rotate-[125deg]">
            <defs>
              <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: "#1E3A8A" }} />
                <stop offset="100%" style={{ stopColor: "#7C3AED" }} />
              </linearGradient>
            </defs>
            <path
              id="circlePath"
              d="M 175, 175 m -150, 0 a 150,150 0 1,1 300,0 a 150,150 0 1,1 -300,0"
              fill="none"
            />
            <text fill="url(#textGradient)" fontSize="28" fontWeight="600" fontFamily="'Inter', sans-serif" letterSpacing="1">
              <textPath href="#circlePath">
                THE POWER OF EVERY TAG · EMERGENCY SCAN ID
              </textPath>
            </text>
          </svg>

          {/* Bottom Label */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-sm">
            <div className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white px-4 py-1 rounded-full text-[10px] font-medium font-['Inter'] shadow-sm transition-all duration-300 hover:scale-105">
              Powered by
            </div>
            <img
              src={companyLogo}
              alt="Logo"
              className="mt-2 mx-auto transition-all duration-300 hover:scale-110"
              width={36}
              height={24}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagQRDesign;