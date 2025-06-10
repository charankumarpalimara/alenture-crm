import React, { useMemo, useState, useEffect } from 'react';
import { Box, useMediaQuery, Typography, Button, Modal, IconButton } from "@mui/material";
import { Form, Input, Select, Button as AntdButton, Col, Row, message, Modal as AntdModal } from "antd";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation, useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from "@mui/material/styles";

const { Option } = Select;

const TicketDetails = () => {
  const [form] = Form.useForm();
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:600px)");
  const isMobile = useMediaQuery("(max-width:484px)");
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const navigate = useNavigate();

  // State
  const [crmIdList, setCrmIdList] = useState([]);
  const [crmName, setCrmName] = useState('');
  const [tasks, setTasks] = useState([]);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [shareEntireExperience, setshareEntireExperience] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  // Ticket data from navigation state
  const ticket = useMemo(() => location.state?.ticket || {}, [location.state]);

  // Fetch CRM IDs
  useEffect(() => {
    const fetchCrmIds = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/getCrmId');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.crmid)) {
            setCrmIdList(data.crmid.map(item => item.crmid));
          }
        }
      } catch (error) {}
    };
    fetchCrmIds();
  }, []);

  // Fetch Tasks for this ticket
  useEffect(() => {
    if (!ticket.experienceid) return;
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/getTaskDataByExpId/${ticket.experienceid}`);
        const data = await response.json();
        if (data && data.data) {
          setTasks(data.data);
        }
      } catch (error) {
        setTasks([]);
      }
    };
    fetchTasks();
  }, [ticket.experienceid]);

  // Table columns
  const columns = [
    { field: "id", headerName: "ID", flex: 0.4, minWidth: 100 },
    { field: "taskname", headerName: "Task name", flex: 1, minWidth: 200 },
    { field: "taskownername", headerName: "Task owner", flex: 1, minWidth: 150 },
    { field: "priority", headerName: "Status", flex: 1, minWidth: 150 },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={handleCompleteTask(params.id)}
            sx={{ color: "#ffffff", backgroundColor: "#0BDA51", width: "30px", height: "30px" }}
            aria-label="complete"
            disableRipple
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            onClick={handleDeleteTask(params.id)}
            sx={{ color: "#ffffff", backgroundColor: "#FF2C2C", width: "30px", height: "30px" }}
            disableRipple
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  // Handle row click (navigate to task details)
  const handleRowClick = (params) => {
    navigate('/taskdetails', { state: { ticket: params.row } });
  };

  // Handle complete task (dummy)
  const handleCompleteTask = (id) => (event) => {
    event.stopPropagation();
    message.info(`Task completed: ${id}`);
  };

  // Handle delete icon click
  const handleDeleteTask = (id) => (event) => {
    event.stopPropagation();
    setDeletingTaskId(id);
    setDeleteModalVisible(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    // TODO: Replace with your API call
    // await fetch(`http://localhost:8080/api/v1/deleteTask/${deletingTaskId}`, { method: "DELETE" });
    setTasks(prev => prev.filter(task => task.id !== deletingTaskId));
    setDeleteModalVisible(false);
    setDeletingTaskId(null);
    message.success("Task deleted successfully!");
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setDeletingTaskId(null);
  };

  // Task creation form (Ant Design)
  const TaskForm = ({ handleClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const priorityOptions = ["Urgent", "High", "Low"];

    const handleFormSubmit = async (values) => {
      const formData = new FormData();
      formData.append("experienceid", ticket.experienceid || "");
      formData.append("taskname", values.taskname || "");
      formData.append("taskowner", values.taskowner || "");
      formData.append("priority", values.priority || "");
      formData.append("discription", values.description || "");

      const sessionData = JSON.parse(sessionStorage.getItem("CrmDetails") || "{}");
      const crmid = sessionData?.crmid || "";
      formData.append("crmid", crmid);

      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/v1/createTask", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          message.success("Task created successfully!");
          form.resetFields();
          handleClose();
          // Optionally, refresh tasks here
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
        form={form}
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
            getPopupContainer={trigger => trigger.parentNode}
          >
            {priorityOptions.map((option) => (
              <Option key={option} value={option}>{option}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Description is required" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter description" size="large" />
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
              htmlType="submit"
              loading={loading}
              style={{
                background: "#3e4396",
                borderRadius: 8,
                fontWeight: "bold",
              }}
            >
              Create Task
            </AntdButton>
          </div>
        </Form.Item>
      </Form>
    );
  };

  // Assign CRM form (Ant Design)
  const AssignCrm = ({ handleClose, crmIdList = [] }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [crmName, setCrmName] = useState('');

    const handleFinish = async (values) => {
      setLoading(true);
      // Your submit logic here
      setTimeout(() => {
        setLoading(false);
        handleClose();
      }, 800);
    };

    return (
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ crmid: "", crmname: "" }}
      >
        <Row gutter={16} style={{ flexDirection: 'column' }}>
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
                getPopupContainer={trigger => trigger.parentNode}
                onChange={async (value) => {
                  try {
                    const res = await fetch(`http://localhost:8080/api/v1/getCrmNamebyId/${value}`);
                    const data = await res.json();
                    setCrmName(data.crmNames || '');
                    form.setFieldsValue({ crmname: data.crmNames || '' });
                  } catch {
                    setCrmName('');
                    form.setFieldsValue({ crmname: '' });
                  }
                }}
              >
                {crmIdList.map((id) => (
                  <Select.Option key={id} value={id}>{id}</Select.Option>
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
            <Button onClick={handleClose} style={{ background: "#e57373", color: "#fff", borderRadius: 8 }}>
              Cancel
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ background: "#3e4396", borderRadius: 8, color: "#fff" }}
            >
              Assign
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  // Modal styles
  const createtaskmodel = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isDesktop ? '60%' : '90%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  const assignmodel = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isDesktop ? '40%' : '90%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Task Management Table */}
      <Box sx={{ backgroundColor: "#fff", borderRadius: 2, p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            sx={{
              background: colors.blueAccent[500],
              fontWeight: "bold",
              color: "#fff",
              textTransform: "none",
              '&:hover': { backgroundColor: colors.blueAccent[600] }
            }}
            startIcon={<AddIcon />}
            onClick={() => setOpenTaskModal(true)}
          >
            Create New Task
          </Button>
        </Box>
        <DataGrid
          rows={tasks}
          columns={columns}
          autoHeight
          onRowClick={handleRowClick}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              color: "#fff",
              fontWeight: "bold"
            }
          }}
        />
      </Box>

      {/* Delete Confirmation Modal */}
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

      {/* Create Task Modal */}
      <Modal
        open={openTaskModal}
        onClose={() => setOpenTaskModal(false)}
        aria-labelledby="task-modal-title"
        aria-describedby="task-modal-description"
      >
        <Box sx={createtaskmodel}>
          <Typography id="task-modal-title" variant="h5" component="h2" sx={{ mb: 3 }}>
            Create New Task
          </Typography>
          <TaskForm handleClose={() => setOpenTaskModal(false)} />
        </Box>
      </Modal>

      {/* Assign CRM Modal */}
      <Modal
        open={shareEntireExperience}
        onClose={() => setshareEntireExperience(false)}
        aria-labelledby="task-modal-title"
        aria-describedby="task-modal-description"
      >
        <Box sx={assignmodel}>
          <Typography id="task-modal-title" variant="h5" component="h2" sx={{ mb: 3 }}>
            Assign To Customer Relationship Manager
          </Typography>
          <AssignCrm
            handleClose={() => setshareEntireExperience(false)}
            crmIdList={crmIdList}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default TicketDetails;