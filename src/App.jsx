// import { useEffect, useRef, useState } from "react";
// import { Input, Button, Space, Form, Modal, Table, message } from "antd";
// import {
//   SearchOutlined,
//   UserAddOutlined,
//   EditOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";
// import { BrowserQRCodeReader } from "@zxing/browser";

// const App = () => {
//   const videoRef = useRef(null);
//   const [codeReader, setCodeReader] = useState(null);
//   const [isScannerVisible, setIsScannerVisible] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [modalForm] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [scannedId, setScannedId] = useState(null);
//   const [userData, setUserData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   const startScanner = async () => {
//     const reader = new BrowserQRCodeReader();
//     setCodeReader(reader);

//     try {
//       const result = await reader.decodeOnceFromVideoDevice(
//         { facingMode: "environment" },
//         videoRef.current
//       );
//       const id = result.getText();
//       setScannedId(id);
//       message.success("QR Code scanned successfully");
//       setIsScannerVisible(false);
//       setIsModalVisible(true);
//     } catch (err) {
//       if (err.name === "NotAllowedError") {
//         message.error("Camera access denied. Please allow camera.");
//       } else if (err.name === "NotFoundError") {
//         message.error("No camera found on this device.");
//       } else {
//         message.error("Could not scan QR Code.");
//       }
//       console.error("Scanner error:", err);
//     }
//   };

//   const stopScanner = () => {
//     try {
//       codeReader?.reset();
//     } catch (e) {
//       console.warn("Scanner reset failed", e);
//     }
//     setCodeReader(null);
//   };

//   useEffect(() => {
//     let timeout;

//     if (isScannerVisible) {
//       timeout = setTimeout(() => {
//         if (videoRef.current) {
//           startScanner();
//         } else {
//           console.warn("Video element not found");
//         }
//       }, 800);
//     } else {
//       stopScanner();
//     }

//     return () => {
//       clearTimeout(timeout);
//       stopScanner();
//     };
//   }, [isScannerVisible]);

//   const handleAddUser = () => {
//     setIsScannerVisible(true);
//   };

//   const handleModalSubmit = async () => {
//     try {
//       const values = await modalForm.validateFields();

//       if (values.password !== values.confirmPassword) {
//         return message.error("Passwords do not match");
//       }

//       setLoading(true);

//       const payload = {
//         ...values,
//         qrId: scannedId,
//         createdAt: new Date().toISOString(),
//       };

//       setUserData((prev) => [
//         ...prev,
//         {
//           ...payload,
//           id: prev.length + 1,
//         },
//       ]);

//       message.success("User registered (mock)");
//       modalForm.resetFields();
//       setIsModalVisible(false);
//       setScannedId(null);
//     } catch (error) {
//       message.error("Form submission failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleModalCancel = () => {
//     modalForm.resetFields();
//     setIsModalVisible(false);
//     setScannedId(null);
//   };

//   const columns = [
//     {
//       title: "S.No",
//       key: "sno",
//       render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
//     },
//     { title: "Name", dataIndex: "name", key: "name" },
//     { title: "Email", dataIndex: "email", key: "email" },
//     { title: "Phone", dataIndex: "phone", key: "phone" },
//     { title: "Referral ID", dataIndex: "referalId", key: "referalId" },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <Space>
//           <Button icon={<EditOutlined />} />
//           <Button danger icon={<DeleteOutlined />} />
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-semibold mb-5">End Users</h1>

//       <div className="flex justify-between items-center mb-5">
//         <Input
//           placeholder="Search Users"
//           prefix={<SearchOutlined />}
//           className="w-full max-w-lg"
//         />
//         <Button
//           icon={<UserAddOutlined />}
//           onClick={handleAddUser}
//           className="ml-4 !bg-purple-400"
//         >
//           Add User (Scan)
//         </Button>
//       </div>

//       {/* Scanner Modal */}
//       <Modal
//         title="Scan QR Code"
//         open={isScannerVisible}
//         onCancel={() => setIsScannerVisible(false)}
//         footer={null}
//         width={400}
//         destroyOnClose
//       >
//         <video
//           ref={videoRef}
//           style={{ width: "100%" }}
//           autoPlay
//           playsInline
//           muted
//         />
//       </Modal>

//       {/* Registration Modal */}
//       <Modal
//         title="Register End User"
//         open={isModalVisible}
//         onCancel={handleModalCancel}
//         footer={[
//           <Button key="cancel" onClick={handleModalCancel}>
//             Cancel
//           </Button>,
//           <Button
//             key="submit"
//             type="primary"
//             loading={loading}
//             onClick={handleModalSubmit}
//           >
//             Create
//           </Button>,
//         ]}
//         width={600}
//       >
//         <Form form={modalForm} layout="vertical" className="mt-4">
//           <Form.Item
//             name="name"
//             label="User Name"
//             rules={[{ required: true, message: "Enter user name" }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="phone"
//             label="Mobile Number"
//             rules={[{ required: true, message: "Enter mobile number" }]}
//           >
//             <Input maxLength={10} />
//           </Form.Item>
//           <Form.Item
//             name="email"
//             label="Email"
//             rules={[
//               { required: true, message: "Enter email" },
//               { type: "email", message: "Invalid email" },
//             ]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="password"
//             label="Password"
//             rules={[{ required: true, message: "Enter password" }]}
//           >
//             <Input.Password />
//           </Form.Item>
//           <Form.Item
//             name="confirmPassword"
//             label="Confirm Password"
//             rules={[{ required: true, message: "Re-enter password" }]}
//           >
//             <Input.Password />
//           </Form.Item>
//           <Form.Item
//             name="referalId"
//             label="Referral (Agent User ID)"
//             rules={[{ required: true, message: "Referral ID required" }]}
//           >
//             <Input />
//           </Form.Item>
//         </Form>
//       </Modal>

//       <Table
//         columns={columns}
//         dataSource={userData}
//         loading={loading}
//         rowKey="id"
//         pagination={{
//           current: currentPage,
//           pageSize,
//           total: userData.length,
//           showSizeChanger: true,
//           showQuickJumper: true,
//           showTotal: (total) => `Total ${total} users`,
//         }}
//         scroll={{ x: true }}
//       />
//     </div>
//   );
// };

// export default App;

import { useEffect, useRef, useState } from "react";
import { Button, Modal, message } from "antd";
import { BrowserQRCodeReader } from "@zxing/browser";

const App = () => {
  const videoRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [result, setResult] = useState(null);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    stopScanner();
    setIsModalOpen(false);
  };

  const startScanner = async () => {
    try {
      const codeReader = new BrowserQRCodeReader();
      setScanner(codeReader);
      const result = await codeReader.decodeOnceFromVideoDevice(
        { facingMode: "environment" },
        videoRef.current
      );
      const scannedText = result.getText();
      setResult(scannedText);
      message.success("QR code scanned!");
      closeModal();
      // Auto open if it's a URL
      if (scannedText.startsWith("http")) {
        window.open(scannedText, "_blank");
      }
    } catch (err) {
      message.error("Failed to scan QR code");
      console.error("Scan error:", err);
    }
  };

  const stopScanner = () => {
    try {
      scanner?.reset();
    } catch (e) {
      console.warn("Scanner reset failed:", e);
    }
    setScanner(null);
  };

  useEffect(() => {
    let timeout;
    if (isModalOpen) {
      timeout = setTimeout(() => {
        if (videoRef.current) startScanner();
      }, 800);
    }
    return () => {
      clearTimeout(timeout);
      stopScanner();
    };
  }, [isModalOpen]);

  return (
    <div style={{ padding: 24 }}>
      <h2>QR Scanner Demo</h2>
      <Button type="primary" onClick={openModal}>
        Open QR Scanner
      </Button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <strong>Scanned Result:</strong> {result}
        </div>
      )}
      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
        width="100vw"
        centered
        style={{ top: 0, padding: 0, background: "black" }}
        bodyStyle={{ padding: 0, background: "black" }}
      >
        <div className="relative w-full h-[80vh] bg-black overflow-hidden">
          {/* Video behind */}
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            autoPlay
            playsInline
            muted
          />

          {/* Overlay */}
          <div className="absolute inset-0 z-10 flex justify-center items-center bg-black/40">
            <div className="relative w-64 h-64 border-2 border-white rounded-lg">
              <div className="absolute inset-0 animate-scanLine bg-gradient-to-b from-transparent via-white/60 to-transparent h-1 w-full" />
            </div>
          </div>

          {/* Instruction text */}
          <div className="absolute bottom-4 w-full text-center text-white z-20 text-sm">
            Align the QR code within the frame
          </div>
        </div>
      </Modal>

      {/* Tailwind animation */}
      <style>
        {`
          @keyframes scanLine {
            0% { top: 0; }
            100% { top: 100%; }
          }
          .animate-scanLine {
            animation: scanLine 2s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default App;
