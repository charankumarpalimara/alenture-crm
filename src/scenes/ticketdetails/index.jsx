import {
  Box,
  useMediaQuery,
  Typography,
  Button,
  useTheme,
  TextField,
  Autocomplete,
  IconButton,
  Modal,
} from "@mui/material";
import {
  Form,
  Input,
  Select,
  Button as AntdButton,
  Col,
  Row,
  message,
  Modal as AntdModal,
  Table,
} from "antd";
import { Formik } from "formik";
import { tokens } from "../../theme";
import * as yup from "yup";
import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useLocation } from "react-router-dom";
import download from "downloadjs";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListNumbered,
  FormatListBulleted,
  InsertPhoto,
  TableChart,
  YouTube,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TableTiptap from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Youtube from "@tiptap/extension-youtube";
import { Underline } from "@tiptap/extension-underline";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const { Option } = Select;

const TicketDetails = () => {
  const [form] = Form.useForm();
  const socketRef = useRef(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:600px)");
  const isMobile = useMediaQuery("(max-width:484px)");
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [crmIdList, setCrmIdList] = useState([]);
  const [tasks, setTasks] = useState([]);
  const Navigate = useNavigate();
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [shareEntireExperience, setshareEntireExperience] = useState(false);
  const ticket = useMemo(() => location.state?.ticket || {}, [location.state]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [completeTaskId, setCompleteTaskId] = useState(null);

  const getExperienceColor = (experience) => {
    switch (experience) {
      case "Frustrated":
        return "#E64A19";
      case "Extremely Frustrated":
        return "#D32F2F";
      case "Happy":
        return "#FBC02D";
      case "Extremely Happy":
        return "#388E3C";
      default:
        return "#616161";
    }
  };

  const handleFormSubmit = (values) => {
    const fullPhoneNumber = `${values.phoneCode}${values.PhoneNo}`;
    console.log("Form Data:", { ...values, fullPhoneNumber });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (_text, _record, index) => <span>{index + 1}</span>, // Serial number
    },
    {
      title: "Task name",
      dataIndex: "taskname",
      key: "taskname",
      width: 200,
    },
    {
      title: "Task owner",
      dataIndex: "taskownername",
      key: "taskownername",
      width: 150,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
    },
    {
      title: "Action",
      key: "actions",
      width: 150,
      render: (_text, record) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={handleCompleteTask(record.id)}
            sx={{
              color: "#ffffff",
              backgroundColor: "#0BDA51",
              width: "30px",
              height: "30px",
            }}
            aria-label="complete"
            disableRipple
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            onClick={handleDeleteTask(record.id)}
            sx={{
              color: "#ffffff",
              backgroundColor: "#FF2C2C",
              width: "30px",
              height: "30px",
            }}
            disableRipple
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const initialValues = {
    organizationid: ticket.organizationid || "",
    organization: ticket.organization || "",
    crmid: ticket.crmid || "",
    cmname: ticket.cmname || "",
    experience: ticket.experience || "",
    branch: ticket.branch || "",
    priority: ticket.priority || "",
    crmname: ticket.crmname || "",
    status: ticket.status || "",
    department: ticket.department || "",
    date: ticket.date || "",
    time: ticket.time || "",
    subject: ticket.subject || "",
    requestdetails: ticket.requestdetails || "",
    phoneCode: ticket.phoneCode || "",
    PhoneNo: ticket.PhoneNo || "",
    notes: ticket.notes || "",
    id: ticket.experienceid || "",
  };

  console.log("Ticket Details:", ticket);

  useEffect(() => {
    const fetchCrmIds = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getCrmId`
        );
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.crmid)) {
            setCrmIdList(data.crmid.map((item) => item.crmid));
          }
        }
      } catch (error) {}
    };
    fetchCrmIds();
  }, []);

  const crmidValue = form.getFieldValue("crmid");

  useEffect(() => {
    if (crmidValue) {
      fetch(`${process.env.REACT_APP_API_URL}/v1/getCrmNamebyId/${crmidValue}`)
        .then((res) => res.json())
        .then((data) => {
          form.setFieldsValue({ crmname: data.crmNames || "" });
        });
    } else {
      form.setFieldsValue({ crmname: "" });
    }
  }, [form, crmidValue]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/getTaskDataByExpId`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            experienceId: ticket.experienceid,
            crmid: ticket.crmid,
          }),
        }
      );
      const data = await response.json();
      if (data && data.data) {
        setTasks(data.data);
      }
    } catch (error) {
      setTasks([]);
    }
  }, [ticket.experienceid, ticket.crmid]);

  useEffect(() => {
    if (!ticket.experienceid || !ticket.crmid) return;
    fetchTasks();
  }, [ticket.experienceid, ticket.crmid, fetchTasks]);

  // For fetchTasks
  useEffect(() => {
    if (!ticket.experienceid || !ticket.crmid) return;
    fetchTasks();
    // Add fetchTasks as dependency
  }, [ticket.experienceid, ticket.crmid, fetchTasks]);

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     if (!ticket.experienceid || !ticket.crmid) return;
  //     try {
  //       const res = await fetch(
  //         `http://localhost:8080/api/v1/getChatMessages?experienceid=${ticket.experienceid}&crmid=${ticket.crmid}`
  //       );
  //       const data = await res.json();
  //       if (Array.isArray(data.messages)) {
  //         setMessages(data.messages.map(msg => ({
  //           text: msg.message,
  //           sender: msg.sender
  //         })));
  //       }
  //     } catch (error) {
  //       setMessages([{ text: "Failed to load messages.", sender: "support" }]);
  //     }
  //   };
  //   fetchMessages();
  // }, [ticket.experienceid, ticket.crmid]);

  const handleDeleteTask = (id) => (event) => {
    event.stopPropagation();
    setDeletingTaskId(id);
    setDeleteModalVisible(true);
  };

  const handleCompleteTask = (id) => async (event) => {
    event.stopPropagation();
    setCompleteTaskId(id);
    setCompleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setDeletingTaskId(null);
  };

  const checkoutSchema = yup.object().shape({
    organization: yup.string().required("Required"),
    cmname: yup.string().required("Required"),
    crmname: yup.string().required("Required"),
    status: yup.string().required("Required"),
    branch: yup.string().required("Required"),
    department: yup.string().required("Required"),
    date: yup.string().required("Required"),
    time: yup.string().required("Required"),
    subject: yup.string().required("Required"),
    phoneCode: yup.string().required("Required"),
    PhoneNo: yup
      .string()
      .matches(/^[0-9]+$/, "Only numbers are allowed")
      .min(10, "Must be at least 10 digits")
      .required("Required"),
    notes: yup.string(),
  });

  const fileUrl =
    "https://upload.wikimedia.org/wikipedia/commons/4/4d/sample.jpg";
  const filename = "sample-file.jpg";

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      download(blob, filename);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log("Selected file:", file.name);
    }
  };

  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "support" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TableTiptap.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube,
    ],
    content: newMessage,
    onUpdate: ({ editor }) => {
      setNewMessage(editor.getHTML());
    },
  });

  const addImage = () => {
    const url = window.prompt("Enter the URL of the image:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutubeVideo = () => {
    const url = window.prompt("Enter YouTube URL:");
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      });
    }
  };

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({
        rows: 3,
        cols: 3,
        withHeaderRow: true,
      })
      .run();
  };

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL);
    if (ticket.experienceid && ticket.crmid) {
      socketRef.current.emit("joinRoom", {
        experienceid: ticket.experienceid,
        crmid: ticket.crmid,
      });
    }
    socketRef.current.on("receiveMessage", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          text: msg.message || msg.messege,
          sender: msg.sender,
          time: msg.time,
          crmname: msg.crmname,
        },
      ]);
    });
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [ticket.experienceid, ticket.crmid]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const cmid = ticket.cmid || "";
    const msgData = {
      experienceid: ticket.experienceid,
      crmid: ticket.crmid,
      cmid,
      crmname: ticket.crmname,
      message: newMessage,
      sender: "manager",
    };

    console.log("Sending message:", msgData);

    // Emit real-time message
    socketRef.current.emit("sendMessage", msgData);

    // Save message to DB via REST API
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/v1/chatInsert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msgData),
      });
    } catch (error) {
      console.error("Error sending message:", error);
      message.error("Failed to send message.");
    }

    setNewMessage("");
    editor.commands.clearContent();
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!ticket.experienceid || !ticket.crmid) return;
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getChatMessages?experienceid=${ticket.experienceid}&crmid=${ticket.crmid}`
        );
        const data = await res.json();
        if (Array.isArray(data.messages)) {
          setMessages(
            data.messages.map((msg) => ({
              text: msg.messege, // <-- use 'messege'
              sender: msg.sender,
              time: msg.time,
              crmname: msg.extraind1, // <-- include crmname if available
            }))
          );
        }
      } catch (error) {
        setMessages([
          { text: "Failed to load messages.", sender: "support", time: "" },
        ]);
      }
    };
    fetchMessages();
  }, [ticket.experienceid, ticket.crmid]);

  useEffect(() => {
    const sendProcessingStatus = async () => {
      const msgData = {
        experienceid: ticket.experienceid,
        status: "Processing",
      };

      try {
        await fetch(
          `${process.env.REACT_APP_API_URL}/v1/updateExperienceStatus`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(msgData),
          }
        );
      } catch (error) {
        console.error("Error sending message:", error);
        message.error("Failed to send message.");
      }
    };

    if (ticket.experienceid) {
      sendProcessingStatus();
    }
  }, [ticket.experienceid]);

  const createtaskmodel = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isDesktop ? "60%" : "90%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const assignmodel = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isDesktop ? "40%" : "90%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const handleRowClick = (params) => {
    Navigate("/crm/taskdetails", { state: { ticket: params.row } });
  };

  // const handleCompleteTask = (id) => (event) => {
  //   event.stopPropagation();
  //   console.log("Task completed:", id);
  // };

  const handleConfirmDelete = async () => {
    if (!deletingTaskId) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/TaskDelete/${deletingTaskId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== deletingTaskId));
        message.success("Task deleted successfully!");
      } else {
        const data = await response.json();
        message.error(data.error || "Failed to delete task.");
      }
    } catch (error) {
      message.error("Error deleting task.");
    }
    setDeleteModalVisible(false);
    setDeletingTaskId(null);
  };

  const handleConfirmComplete = async () => {
    if (!completeTaskId) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/updateTaskStatus/${completeTaskId}`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        // setTasks(prev => prev.filter(task => task.id !== completeTaskId));
        message.success("Task deleted successfully!");
        fetchTasks();
      } else {
        const data = await response.json();
        message.error(data.error || "Failed to Update task Status.");
      }
    } catch (error) {
      message.error("Error deleting task.");
    }
    setCompleteModalVisible(false);
    setCompleteTaskId(null);
  };

  const TaskForm = ({ handleClose, fetchTasks }) => {
    const [taskForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const priorityOptions = ["Urgent", "High", "Low"];

    const handleFormSubmit = async (values) => {
      const formData = new FormData();
      formData.append("experienceid", ticket.experienceid || "");
      formData.append("taskname", values.taskname || "");
      formData.append("taskowner", values.taskowner || "");
      formData.append("priority", values.priority || "");
      formData.append("discription", values.description || "");

      const sessionData = JSON.parse(
        sessionStorage.getItem("CrmDetails") || "{}"
      );
      const crmid = sessionData?.crmid || "";
      formData.append("crmid", crmid);

      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/createTask`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (response.ok) {
          message.success("Task created successfully!");
          taskForm.resetFields();
          handleClose();
          if (fetchTasks) fetchTasks(); // update table instantly
        } else {
          message.error("Failed to create task.");
        }
      } catch (error) {
        message.error("Error creating task.");
      }
      setLoading(false);
    };

    return (
      <Form
        form={taskForm}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={{
          taskname: "",
          taskowner: "",
          description: "",
          priority: "",
        }}
      >
        <Form.Item
          label="Task Name"
          name="taskname"
          rules={[{ required: true, message: "Task Name is required" }]}
        >
          <Input placeholder="Enter task name" size="large" />
        </Form.Item>

        <Form.Item
          label="Task Owner"
          name="taskowner"
          rules={[{ required: true, message: "Task Owner is required" }]}
        >
          <Input placeholder="Enter task owner" size="large" />
        </Form.Item>

        <Form.Item
          label="Priority"
          name="priority"
          rules={[{ required: true, message: "Priority is required" }]}
        >
          <Select
            placeholder="Select priority"
            size="large"
            getPopupContainer={(trigger) => trigger.parentNode}
          >
            {priorityOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Description is required" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Enter description"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <AntdButton
              onClick={handleClose}
              style={{
                background: "#e57373",
                color: "#fff",
                borderRadius: 8,
                fontWeight: "bold",
              }}
            >
              Cancel
            </AntdButton>
            <AntdButton
              type="primary"
              onClick={() => taskForm.submit()}
              disabled={loading}
              style={{
                background: "#3e4396",
                borderRadius: 8,
                fontWeight: "bold",
              }}
            >
              {loading ? "Creating..." : "Create Task"}
            </AntdButton>
          </div>
        </Form.Item>
      </Form>
    );
  };

  const AssignCrm = ({ handleClose, crmIdList = [] }) => {
    const [assignForm] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleFinish = async (values) => {
      setLoading(true);
      try {
        const experienceid = ticket.experienceid;
        const existcrmid = ticket.crmid;
        const crmid = values.crmid;
        const crmname = values.crmname;

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/AssignTask`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ experienceid, crmid, existcrmid, crmname }),
          }
        );

        if (response.ok) {
          message.success("Task assigned successfully!");
          handleClose();
        } else {
          const data = await response.json();
          message.error(data.error || "Failed to assign task.");
        }
      } catch (error) {
        message.error("Error assigning task.");
      }
      setLoading(false);
    };

    return (
      <Form
        form={assignForm}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ crmid: "", crmname: "" }}
      >
        <Row gutter={16} style={{ flexDirection: "column" }}>
          <Col span={24}>
            <Form.Item
              label="CRM ID"
              name="crmid"
              rules={[{ required: true, message: "Please select CRM ID" }]}
            >
              <Select
                showSearch
                placeholder="Select CRM ID"
                optionFilterProp="children"
                size="large"
                getPopupContainer={(trigger) => trigger.parentNode}
                onChange={async (value) => {
                  try {
                    const res = await fetch(
                      `${process.env.REACT_APP_API_URL}/v1/getCrmNamebyId/${value}`
                    );
                    const data = await res.json();
                    assignForm.setFieldsValue({ crmname: data.crmNames || "" });
                  } catch {
                    assignForm.setFieldsValue({ crmname: "" });
                  }
                }}
              >
                {crmIdList.map((id) => (
                  <Select.Option key={id} value={id}>
                    {id}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="CRM Name"
              name="crmname"
              rules={[{ required: true, message: "CRM Name is required" }]}
            >
              <Input placeholder="CRM Name" disabled readOnly size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end" gutter={8}>
          <Col>
            <Button
              onClick={handleClose}
              style={{ background: "#e57373", color: "#fff", borderRadius: 8 }}
            >
              Cancel
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={() => assignForm.submit()}
              disabled={loading}
              style={{
                background: "#3e4396",
                borderRadius: 8,
                color: "#fff",
                ...(loading && { opacity: 0.7 }), // Visual feedback for loading state
              }}
            >
              {loading ? "Assigning..." : "Assign"}
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  // const customerManagers = [
  //   "Rambabu",
  //   "Charan",
  //   "Lakshman",
  //   "Satya dev",
  //   "Ram",
  // ];

  const priority = ["Urgent", "High", "Medium", "Low"];

  // const status = [
  //   "Pending",
  //   "Processing",
  //   "Closed",
  // ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr",
          md: "repeat(2, 1fr)",
        },
        gap: { xs: 2, sm: 3 },
        p: { xs: 1, sm: 2 },
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* First Column - Ticket Details */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          p: isDesktop ? 3 : 2,
          borderRadius: "8px",
          gridColumn: {
            xs: "1 / -1",
            md: "1 / 2",
          },
        }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={checkoutSchema}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            setFieldValue,
            touched,
            errors,
            handleBlur,
            handleChange,
          }) => (
            <form>
              <Box
                display="grid"
                gap={2}
                gridTemplateColumns={{
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                }}
              >
                {/* Ticket Details Fields */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Experience ID
                  </Typography>
                  <Typography>{values.id}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Organization
                  </Typography>
                  <Typography>{values.organization}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Branch
                  </Typography>
                  <Typography>{values.branch}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Customer Manager
                  </Typography>
                  <Typography>{values.cmname}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Customer Relationship Manager
                  </Typography>
                  <Typography>{values.crmname}</Typography>
                </Box>

                {isEditing ? (
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#555",
                        fontWeight: "bold",
                        marginBottom: "5px",
                      }}
                    >
                      Priority
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={priority}
                      value={values.priority || null}
                      onChange={async (event, newValue) => {
                        setFieldValue("priority", newValue || "");

                        // Call backend API to update priority
                        try {
                          await fetch(
                            `${process.env.REACT_APP_API_URL}/v1/updateExperiencePriority`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                experienceid: ticket.experienceid, // or ticket.experienceid
                                priority: newValue,
                              }),
                            }
                          );
                          message.success("Priority updated!");
                        } catch (error) {
                          message.error("Failed to update priority.");
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{
                            display: isEditing ? "block" : "none",
                            "& .MuiInputBase-root": {
                              height: "40px",
                            },
                          }}
                          error={!!touched.priority && !!errors.priority}
                          helperText={touched.priority && errors.priority}
                          disabled={!isEditing}
                        />
                      )}
                      disabled={!isEditing}
                      sx={{
                        gridColumn: "span 1",
                        "& .MuiAutocomplete-listbox": {
                          maxHeight: "200px",
                          padding: 0,
                          "& .MuiAutocomplete-option": {
                            minHeight: "32px",
                            padding: "4px 16px",
                          },
                        },
                      }}
                      freeSolo
                      forcePopupIcon
                      popupIcon={<ArrowDropDownIcon />}
                    />
                  </Box>
                ) : (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#555", fontWeight: "bold" }}
                    >
                      Priority
                    </Typography>
                    <Typography
                      sx={{ color: getExperienceColor(values.priority) }}
                    >
                      {values.priority}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Status
                  </Typography>
                  <Typography
                    sx={{ color: getExperienceColor(values.priority) }}
                  >
                    {values.status}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Date
                  </Typography>
                  <Typography>{values.date}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Time
                  </Typography>
                  <Typography>{values.time}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Experience
                  </Typography>
                  <Typography
                    sx={{ color: getExperienceColor(values.experience) }}
                  >
                    {values.experience}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Impact
                  </Typography>
                  <Typography>{values.department}</Typography>
                </Box>

                <Box
                  sx={{
                    gridColumn: { xs: "auto", sm: "span 2", md: "span 3" },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Subject
                  </Typography>
                  <Typography>{values.subject}</Typography>
                </Box>
              </Box>

              <Box
                sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
              >
                {/* Request Details Section */}
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#555", fontWeight: "bold" }}
                    >
                      Request Details
                    </Typography>
                  </Box>
                  <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
                    {values.requestdetails}
                  </Typography>
                </Box>

                {/* File Upload Section */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1,
                    borderRadius: 1,
                    width: "fit-content",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    position: "relative",
                    overflow: "hidden",
                    border: "1px solid #ccc",
                  }}
                >
                  <Box
                    component="label"
                    htmlFor="fileInput"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      width="20"
                      height="20"
                      fill="#555"
                      style={{ marginRight: "8px" }}
                    >
                      <path d="M64 480H296.2C305.1 491.8 317.3 502.3 329.7 511.3C326.6 511.7 323.3 512 320 512H64C28.65 512 0 483.3 0 448V64C0 28.65 28.65 0 64 0H220.1C232.8 0 245.1 5.057 254.1 14.06L369.9 129.9C378.9 138.9 384 151.2 384 163.9V198.6C372.8 201.8 362.1 206 352 211.2V192H240C213.5 192 192 170.5 192 144V32H64C46.33 32 32 46.33 32 64V448C32 465.7 46.33 480 64 480V480zM347.3 152.6L231.4 36.69C229.4 34.62 226.8 33.18 224 32.48V144C224 152.8 231.2 160 240 160H351.5C350.8 157.2 349.4 154.6 347.3 152.6zM448 351.1H496C504.8 351.1 512 359.2 512 367.1C512 376.8 504.8 383.1 496 383.1H448V431.1C448 440.8 440.8 447.1 432 447.1C423.2 447.1 416 440.8 416 431.1V383.1H368C359.2 383.1 352 376.8 352 367.1C352 359.2 359.2 351.1 368 351.1H416V303.1C416 295.2 423.2 287.1 432 287.1C440.8 287.1 448 295.2 448 303.1V351.1zM576 368C576 447.5 511.5 512 432 512C352.5 512 288 447.5 288 368C288 288.5 352.5 224 432 224C511.5 224 576 288.5 576 368zM432 256C370.1 256 320 306.1 320 368C320 429.9 370.1 480 432 480C493.9 480 544 429.9 544 368C544 306.1 493.9 256 432 256z" />
                    </svg>
                    <Typography variant="body2">
                      {selectedFile ? selectedFile.name : "Attach Files"}
                    </Typography>
                  </Box>
                  <input
                    id="fileInput"
                    type="file"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0,
                      cursor: "pointer",
                      fontSize: 0,
                    }}
                    onChange={handleFileChange}
                  />
                </Box>

                {/* Download Button */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    disabled={isDownloading}
                    onClick={handleDownload}
                    sx={{ minWidth: 180 }}
                  >
                    {isDownloading ? "Downloading..." : "Download Attachment"}
                  </Button>
                </Box>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    mt: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      padding: "12px 24px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
                      transition: "0.3s",
                      backgroundColor: colors.redAccent[400],
                      color: "#ffffff",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: colors.redAccent[500],
                        boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
                      },
                    }}
                    onClick={async () => {
                      try {
                        await fetch(
                          `${process.env.REACT_APP_API_URL}/v1/updateExperienceStatusToResolve`,
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              experienceid: ticket.experienceid,
                              status: "Resolved",
                            }),
                          }
                        );
                        message.success(
                          "Experience status updated to Resolved!"
                        );
                        Navigate("/crm");
                      } catch (error) {
                        message.error("Failed to update status.");
                      }
                    }}
                  >
                    Close
                  </Button>

                  {isEditing ? (
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setIsEditing(false)}
                        sx={{
                          padding: "12px 24px",
                          fontSize: "14px",
                          fontWeight: "bold",
                          borderRadius: "8px",
                          boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
                          transition: "0.3s",
                          backgroundColor: colors.redAccent[400],
                          color: "#ffffff",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: colors.redAccent[500],
                            boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
                          },
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        variant="contained"
                        onClick={() => setIsEditing(false)}
                        sx={{
                          padding: "12px 24px",
                          fontSize: "14px",
                          fontWeight: "bold",
                          borderRadius: "8px",
                          boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
                          transition: "0.3s",
                          backgroundColor: colors.blueAccent[700],
                          color: "#ffffff",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: colors.blueAccent[600],
                            boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
                          },
                        }}
                      >
                        Save
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => setIsEditing(true)}
                      sx={{
                        padding: "12px 24px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        borderRadius: "8px",
                        boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
                        transition: "0.3s",
                        backgroundColor: colors.blueAccent[700],
                        color: "#ffffff",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: colors.blueAccent[600],
                          boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
                        },
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
      {/* Second Column - Customer Support */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          p: { xs: 1, sm: isDesktop ? 3 : 2 },
          borderRadius: "8px",
          gridColumn: { xs: "1 / -1", md: "2 / 3" },
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "100%",
          minWidth: 0,
        }}
      >
        {/* Chat Section */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            minHeight: isMobile ? "550px" : "",
            maxHeight: isMobile ? "600px" : "620px",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
            {" "}
            Discussions
          </Typography>
          <Typography sx={{ mb: 2, color: colors.grey[600] }}>
            Discuss with Customer Support
          </Typography>

          {/* Messages Display */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: "4px",
              p: 2,
              mb: 2,
              border: "1px solid #ddd",
              overflowY: "auto",
              minHeight: "200px",
              maxHeight: "800px",
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent:
                    message.sender === "manager" ? "flex-start" : "flex-end",
                }}
              >
                <Box>
                  {/* Show extraind1 above the message if sender is manager */}
                  {message.sender === "manager" ? (
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.grey[700],
                        fontWeight: "bold",
                        mb: 0.5,
                        display: "block",
                        textAlign: "left",
                      }}
                    >
                      {message.crmname}
                    </Typography>
                  ) : (
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.grey[700],
                        fontWeight: "bold",
                        mb: 0.5,
                        display: "block",
                        textAlign: "left",
                      }}
                    >
                      User
                    </Typography>
                  )}
                  {/* Message bubble */}
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor:
                        message.sender === "manager"
                          ? colors.blueAccent[100]
                          : "#f0f0f0",
                      display: "inline-block",
                      minWidth: 80,
                      maxWidth: 350,
                      textAlign: "left",
                    }}
                    dangerouslySetInnerHTML={{ __html: message.text }}
                  />
                  {/* Time below the message */}
                  {message.time && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#aaa",
                        display: "block",
                        mt: 0.5,
                        textAlign:
                          message.sender === "manager" ? "left" : "right",
                      }}
                    >
                      {message.time}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Tiptap Editor */}
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "4px",
              // flexGrow: 1,
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Toolbar */}
            {editor && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  p: 1,
                  borderBottom: `1px solid ${colors.grey[300]}`,
                  flexWrap: "wrap",
                }}
              >
                <IconButton
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  color={editor.isActive("bold") ? "primary" : "default"}
                  size="small"
                >
                  <FormatBold fontSize="small" />
                </IconButton>

                <IconButton
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  color={editor.isActive("italic") ? "primary" : "default"}
                  size="small"
                >
                  <FormatItalic fontSize="small" />
                </IconButton>

                <IconButton
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  color={editor.isActive("underline") ? "primary" : "default"}
                  size="small"
                >
                  <FormatUnderlined fontSize="small" />
                </IconButton>

                <IconButton
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  color={editor.isActive("bulletList") ? "primary" : "default"}
                  size="small"
                >
                  <FormatListBulleted fontSize="small" />
                </IconButton>

                <IconButton
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  color={editor.isActive("orderedList") ? "primary" : "default"}
                  size="small"
                >
                  <FormatListNumbered fontSize="small" />
                </IconButton>

                <IconButton onClick={addImage} size="small">
                  <InsertPhoto fontSize="small" />
                </IconButton>

                <IconButton onClick={addTable} size="small">
                  <TableChart fontSize="small" />
                </IconButton>

                <IconButton onClick={addYoutubeVideo} size="small">
                  <YouTube fontSize="small" />
                </IconButton>
              </Box>
            )}

            {/* Editor Content */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                overflow: "scroll",
                height: "250px",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  minHeight: "100px",
                  maxHeight: "100px",
                  "& .tiptap": {
                    minHeight: "200px",
                    outline: "none",
                    "& p": {
                      margin: 0,
                      marginBottom: "0.5em",
                    },
                  },
                }}
              >
                <EditorContent editor={editor} />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            maxHeight: "100px",
            width: "100%",
            mt: 1,
          }}
        >
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            fullWidth
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: "#ffffff",
              "&:hover": { backgroundColor: colors.blueAccent[600] },
              textTransform: "none",
              minWidth: 0,
              width: "100%",
              fontSize: { xs: "14px", sm: "16px" },
            }}
          >
            Send
          </Button>
        </Box>
      </Box>

      {/* Third Column - Task Management */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          p: { xs: 1, sm: isDesktop ? 3 : 2 },
          borderRadius: "8px",
          gridColumn: { xs: "1 / -1", md: "1 / -1" },
          mt: { xs: 2, md: 0 },
          width: "100%",
          minWidth: 0,
        }}
      >
        {/* Ant Design Table */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "flex-end",
            alignItems: "stretch",
            mb: 2,
            gap: 2,
            width: "100%",
            minWidth: 0,
          }}
        >
          <Button
            variant="contained"
            fullWidth
            sx={{
              background: colors.blueAccent[500],
              fontWeight: "bold",
              color: "#ffffff",
              whiteSpace: "nowrap",
              textTransform: "none",
              "&:hover": { backgroundColor: colors.blueAccent[600] },
              width: isMobile ? "45%" : "20%",

              fontSize: { xs: "12px", sm: "14px" },
            }}
            startIcon={<AddIcon />}
            onClick={() => setOpenTaskModal(true)}
          >
            Create New Task
          </Button>
        </Box>

        {/* Responsive Table Wrapper */}
        <Box sx={{ width: "100%", overflowX: "auto", minWidth: 0 }}>
          <Table
            className="custom-ant-table-header"
            columns={columns}
            dataSource={tasks}
            rowKey="id"
            pagination={false}
            style={{
              marginBottom: 24,
              minWidth: 600, // Always a number, not an object!
            }}
            onRow={(record) => ({
              onClick: () => handleRowClick({ row: record }),
              style: { cursor: "pointer" },
            })}
            scroll={{ x: true }}
            bordered
          />
        </Box>

        <AntdModal
          title="Confirm Delete"
          open={deleteModalVisible}
          onOk={handleConfirmDelete}
          onCancel={handleCancelDelete}
          okText="Confirm"
          cancelText="Cancel"
          centered
        >
          <p>Are you sure you want to delete this task?</p>
        </AntdModal>

        <AntdModal
          title="Confirm Delete"
          open={completeModalVisible}
          onOk={handleConfirmComplete}
          onCancel={handleCancelDelete}
          okText="Confirm"
          cancelText="Cancel"
          centered
        >
          <p>Are you sure you want to Complete this task?</p>
        </AntdModal>
        {/* Responsive Assign To Button */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            alignItems: "stretch",
            mb: 2,
            gap: 2,
            mt: 2,
            width: "100%",
            minWidth: 0,
          }}
        >
          <Button
            variant="contained"
            fullWidth
            sx={{
              background: colors.blueAccent[500],
              fontWeight: "bold",
              color: "#ffffff",
              whiteSpace: "nowrap",
              textTransform: "none",
              // padding: "14px 20px",
              "&:hover": {
                backgroundColor: colors.blueAccent[600],
              },
              width: isMobile ? "25%" : "20%",
              fontSize: { xs: "12px", sm: "14px" },
            }}
            onClick={() => setshareEntireExperience(true)}
          >
            Assign To
          </Button>
        </Box>

        {/* Modals */}
        <Modal
          open={openTaskModal}
          onClose={() => setOpenTaskModal(false)}
          aria-labelledby="task-modal-title"
          aria-describedby="task-modal-description"
        >
          <Box sx={createtaskmodel}>
            <Typography
              id="task-modal-title"
              variant="h5"
              component="h2"
              sx={{ mb: 3 }}
            >
              Create New Task
            </Typography>
            {/* Pass fetchTasks to TaskForm */}
            <TaskForm
              handleClose={() => setOpenTaskModal(false)}
              fetchTasks={fetchTasks}
            />
          </Box>
        </Modal>

        <Modal
          open={shareEntireExperience}
          onClose={() => setshareEntireExperience(false)}
          aria-labelledby="task-modal-title"
          aria-describedby="task-modal-description"
        >
          <Box sx={assignmodel}>
            <Typography
              id="task-modal-title"
              variant="h5"
              component="h2"
              sx={{ mb: 3 }}
            >
              Assign To Customer Relationship Manager
            </Typography>
            <AssignCrm
              handleClose={() => setshareEntireExperience(false)}
              crmIdList={crmIdList}
            />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default TicketDetails;
