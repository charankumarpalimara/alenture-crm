import React, { useState, useEffect } from "react";
import { Input, Table, Row, Col, Button, Checkbox, Dropdown, Menu } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getCrmId } from "../../config";

// const { Title } = Typography;

// Columns for Ant Design Table
const columns = [
  { title: "ID", dataIndex: "experienceid", key: "experienceid", width: 100 },
  { title: "Subject", dataIndex: "subject", key: "subject", width: 200 },
  { title: "Priority", dataIndex: "priority", key: "priority", width: 150 },
  { title: "Status", dataIndex: "status", key: "status", width: 150 },
  { title: "Created", dataIndex: "date", key: "date", width: 150 },
  { title: "Updated", dataIndex: "time", key: "time", width: 150 },
];

const AllExperiences = ({ apiUrl }) => {
  const navigate = useNavigate();

  // State for tickets
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    priority: [],
    status: [],
  });

  // Fetch from API on mount
  const fetchTickets = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/getTicketsbycrmId/${getCrmId()}`
      );
      const data = await response.json();
      if (response.ok && Array.isArray(data.experienceDetails)) {
        const transformedData = data.experienceDetails.map((item, idx) => ({
          key: item.id || idx,
          experienceid: item.experienceid || "N/A",
          subject: item.subject || "N/A",
          priority: item.priority || "N/A",
          status: item.status || "N/A",
          date: item.date || "N/A",
          time: item.time || "N/A",
          organizationid: item.organizationid,
          organizationname: item.organizationname || "N/A",
          crmid: item.extraind1 || "N/A",
          crmname: item.extraind2,
          branch: item.branch || "N/A",
          cmid: item.cmid || "N/A",
          cmname: item.cmname || "N/A",
          state: item.extraind4 || "N/A",
          city: item.extraind5 || "N/A",
          postalcode: item.extraind6 || "N/A",
        }));
        setTickets(transformedData);
        setFilteredTickets(transformedData);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line
  }, []);

  // Live update: refetch tickets on relevant notification
  useEffect(() => {
    // const WS_URL = process.env.REACT_APP_WS_URL ;
    const ws = new window.WebSocket(process.env.REACT_APP_WS_URL);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "notification" && data.crmid === getCrmId()) {
          fetchTickets();
        }
      } catch (e) {}
    };
    return () => ws.close();
    // eslint-disable-next-line
  }, []);

  // Search filter
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(value, selectedFilters);
  };

  // Handle Filter Selection
  const handleFilterSelect = (filterType, value) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };
      updatedFilters[filterType] = updatedFilters[filterType].includes(value)
        ? updatedFilters[filterType].filter((item) => item !== value)
        : [...updatedFilters[filterType], value];
      applyFilters(searchTerm, updatedFilters);
      return updatedFilters;
    });
  };

  // Apply Filters
  const applyFilters = (search, filters) => {
    let filtered = tickets;
    if (search.trim()) {
      filtered = filtered.filter((ticket) =>
        Object.values(ticket).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    if (filters.priority.length) {
      filtered = filtered.filter((ticket) =>
        filters.priority.includes(ticket.priority)
      );
    }
    if (filters.status.length) {
      filtered = filtered.filter((ticket) =>
        filters.status.includes(ticket.status)
      );
    }
    setFilteredTickets(filtered);
  };

  // Get Unique Values for Filters
  const getUniqueValues = (key) => [
    ...new Set(tickets.map((ticket) => ticket[key])),
  ];

  const handleRowClick = (record) => {
    navigate("/crm/ticketdetails", { state: { ticket: record } });
  };

  // Filter Dropdown Menu
  const filterMenu = (
    <Menu>
      <Menu.ItemGroup title="Priority">
        {getUniqueValues("priority").map((priority) => (
          <Menu.Item key={priority}>
            <Checkbox
              checked={selectedFilters.priority.includes(priority)}
              onChange={() => handleFilterSelect("priority", priority)}
            >
              {priority}
            </Checkbox>
          </Menu.Item>
        ))}
      </Menu.ItemGroup>
      <Menu.ItemGroup title="Status">
        {getUniqueValues("status").map((status) => (
          <Menu.Item key={status}>
            <Checkbox
              checked={selectedFilters.status.includes(status)}
              onChange={() => handleFilterSelect("status", status)}
            >
              {status}
            </Checkbox>
          </Menu.Item>
        ))}
      </Menu.ItemGroup>
    </Menu>
  );

  return (
    <div style={{ margin: 10 }}>
      {/* Toolbar */}
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8}>
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            prefix={<SearchOutlined />}
            allowClear
            size="large"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Button
            type="primary"
            icon={<ImportOutlined />}
            style={{ fontWeight: "bold", background: "#3e4396", width: "100%" }}
            onClick={() => alert("Export Data!")}
            block
          >
            Export
          </Button>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Dropdown
            overlay={filterMenu}
            trigger={["click"]}
            visible={filterVisible}
            onVisibleChange={setFilterVisible}
            placement="bottomRight"
          >
            <Button
              type="primary"
              icon={<FilterOutlined />}
              style={{
                fontWeight: "bold",
                background: "#3e4396",
                width: "100%",
              }}
              block
            >
              Filter
            </Button>
          </Dropdown>
        </Col>
      </Row>

      {/* Data Table */}
      <Table
        className="custom-ant-table-header"
        columns={columns}
        dataSource={filteredTickets}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 900 }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: "pointer" },
        })}
        rowClassName={() => "custom-row"}
        bordered
        style={{
          background: "#fff",
          borderRadius: 8,
          fontSize: 16,
        }}
      />
      <style>
        {`
          .custom-row:hover {
            background-color: #D9EAFD !important;
          }
        `}
      </style>
    </div>
  );
};

export default AllExperiences;
