import { useEffect, useRef, useState } from "react";
import {
  Input,
  Button,
  Space,
  Form,
  Modal,
  Table,
  message,
} from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { BrowserQRCodeReader } from "@zxing/browser";

const App = () => {
  const videoRef = useRef(null);
  const [codeReader, setCodeReader] = useState(null);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [scannedId, setScannedId] = useState(null);
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const startScanner = async () => {
    const reader = new BrowserQRCodeReader();
    setCodeReader(reader);

    try {
      const result = await reader.decodeOnceFromVideoDevice(
        { facingMode: "environment" },
        videoRef.current
      );
      const id = result.getText();
      setScannedId(id);
      message.success("QR Code scanned successfully");
      setIsScannerVisible(false);
      setIsModalVisible(true);
    } catch (err) {
      console.error("Scanner error:", err);
      message.error("Could not scan QR Code");
    }
  };

  const stopScanner = () => {
    try {
      codeReader?.reset();
    } catch (e) {
      console.warn("Scanner reset failed", e);
    }
    setCodeReader(null);
  };

  useEffect(() => {
    if (isScannerVisible && videoRef.current) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => stopScanner();
  }, [isScannerVisible]);

  const handleAddUser = () => {
    setIsScannerVisible(true);
  };

  const handleModalSubmit = async () => {
    try {
      const values = await modalForm.validateFields();

      if (values.password !== values.confirmPassword) {
        return message.error("Passwords do not match");
      }

      setLoading(true);

      const payload = {
        ...values,
        qrId: scannedId,
        createdAt: new Date().toISOString(),
      };

      setUserData((prev) => [
        ...prev,
        {
          ...payload,
          id: prev.length + 1,
        },
      ]);

      message.success("User registered (mock)");
      modalForm.resetFields();
      setIsModalVisible(false);
      setScannedId(null);
    } catch (error) {
      message.error("Form submission failed");
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    modalForm.resetFields();
    setIsModalVisible(false);
    setScannedId(null);
  };

  const columns = [
    {
      title: "S.No",
      key: "sno",
      render: (_, __, index) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Referral ID", dataIndex: "referalId", key: "referalId" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} />
          <Button danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-5">End Users</h1>

      <div className="flex justify-between items-center mb-5">
        <Input
          placeholder="Search Users"
          prefix={<SearchOutlined />}
          className="w-full max-w-lg"
        />
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={handleAddUser}
          className="ml-4"
        >
          Add User (Scan)
        </Button>
      </div>

      {/* Scanner Modal */}
      <Modal
        title="Scan QR Code"
        open={isScannerVisible}
        onCancel={() => setIsScannerVisible(false)}
        footer={null}
        width={400}
        destroyOnClose
      >
        <video
          ref={videoRef}
          style={{ width: "100%" }}
          autoPlay
          playsInline
          muted
        />
      </Modal>

      {/* Registration Modal */}
      <Modal
        title="Register End User"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleModalSubmit}
          >
            Create
          </Button>,
        ]}
        width={600}
      >
        <Form form={modalForm} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="User Name"
            rules={[{ required: true, message: "Enter user name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Mobile Number"
            rules={[{ required: true, message: "Enter mobile number" }]}
          >
            <Input maxLength={10} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Enter email" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Enter password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={[{ required: true, message: "Re-enter password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="referalId"
            label="Referral (Agent User ID)"
            rules={[{ required: true, message: "Referral ID required" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        columns={columns}
        dataSource={userData}
        loading={loading}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize,
          total: userData.length,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} users`,
        }}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default App;