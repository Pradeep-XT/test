// import { useEffect, useRef } from "react";
// import { useParams, useSearchParams } from "react-router-dom";
// import QRCodeStyling from "qr-code-styling";

// const TagQRDesign = () => {
//   const { id } = useParams();
//   const [searchParams] = useSearchParams();
//   const qrRef = useRef(null);

//   const qrCode = new QRCodeStyling({
//     width: 220,
//     height: 220,
//     type: "svg",
//     data: `${window.location.origin}/public-url/${id}`,
//     dotsOptions: {
//       color: "#2E63A5",
//       type: "dots",
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
//     if (qrRef.current) {
//       qrCode.append(qrRef.current);
//     }
//   }, [id]);

//   // Auto print if ?print=true
//   const shouldPrint = searchParams.get("print") === "true";
//   useEffect(() => {
//     if (shouldPrint) {
//       setTimeout(() => window.print(), 500);
//     }
//   }, [shouldPrint]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-none p-8 print:p-0">
//       <div className="relative flex flex-col items-center justify-center w-[400px] h-[400px] print:scale-90 print:shadow-none">
//         {/* Circular Text */}
//         <svg width="400" height="400" className="absolute">
//           <defs>
//             <path
//               id="circlePath"
//               d="M200,200 m-150,0 a150,150 0 1,1 300,0 a150,150 0 1,1 -300,0"
//             />
//           </defs>
//           <text fill="#2E63A5" fontSize="22" fontFamily="Arial">
//             <textPath href="#circlePath" startOffset="10%" className="text1">
//               VERY TAG EMERGENCY SCAN ID
//             </textPath>
//           </text>
//           <text fill="#2E63A5" fontSize="22" fontFamily="Arial">
//             <textPath href="#circlePath" startOffset="-40%" className="text2">
//               VERY TAG EMERGENCY SCAN ID
//             </textPath>
//           </text>
//         </svg>

//         {/* CSS for Text Animation */}
//         <style>
//           {`
//             @keyframes scrollText1 {
//               0% {
//                 startOffset: 10%;
//               }
//               50% {
//                 startOffset: 60%;
//               }
//               50.01% {
//                 startOffset: -40%;
//               }
//               100% {
//                 startOffset: 10%;
//               }
//             }

//             @keyframes scrollText2 {
//               0% {
//                 startOffset: -40%;
//               }
//               50% {
//                 startOffset: 10%;
//               }
//               100% {
//                 startOffset: 60%;
//               }
//             }

//             .text1 {
//               animation: scrollText1 8s linear infinite;
//             }

//             .text2 {
//               animation: scrollText2 8s linear infinite;
//             }
//           `}
//         </style>

//         {/* QR Code */}
//         <div className="z-10 bg-none p-4 rounded-lg shadow-md">
//           <div ref={qrRef} />
//         </div>

//         {/* TagQQ Label */}
//         <div className="absolute top-[30px] px-6 py-1 bg-[#2E63A5] rounded-lg text-white text-xl font-semibold">
//           TagQQ
//         </div>

//         {/* Powered By */}
//         <div className="absolute bottom-[20px] flex flex-col items-center">
//           <span className="text-xs text-[#2E63A5]">Powered by</span>
//           <span className="text-base font-bold text-black">xtown</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TagQRDesign;


// src/pages/TagQRPage.jsx
import React from "react";
import StyledQRCode from "./StyledQRCode.jsx";
import companyLogo from './assets/company_logo.png'


export default function TagQRPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fffdf7] p-4">
      {/* Top Label */}
      

      {/* Circular Text */}
      <div className="relative w-[250px] h-[250px] flex items-center justify-center">
        <div className="bg-[#2F59A7] text-white px-6 py-2 rounded-full text-lg font-semibold absolute top-0 ">
        TagQQ
      </div>
        <div className="absolute w-full h-full flex items-center justify-center  -top-5">
          <StyledQRCode />
        </div>
        <svg viewBox="0 0 350 350" className="absolute w-full h-full rotate-[125deg]">
          <path
            id="circlePath"
            d="M 175, 175 m -150, 0 a 150,150 0 1,1 300,0 a 150,150 0 1,1 -300,0"
            fill="none"
          />
          <text fill="#2F59A7" fontSize="30" className="font-bold" fontFamily="sans-serif">
            <textPath href="#circlePath" startOffset="0%">
              THE POWER OF EVERY TAG · EMERGENCY SCAN ID 
            </textPath>
          </text>
        </svg>
        <div className="mt-4 text-center text-sm">
        <div className="bg-[#2F59A7] text-white px-3 py-0.5 rounded-full inline-block text-[6px] absolute bottom-15 left-25">
          Powered by
 
        </div>
        <img src={companyLogo} alt="Logo" className="absolute bottom-10 left-28" width={35} height={20} />
      </div>
      </div>

      {/* Powered By */}
      
    </div>
  );
}
