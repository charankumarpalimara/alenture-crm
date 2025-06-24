import { Box } from "@mui/material";
import {  Input, Row, Col,  Typography, Collapse } from "antd";
// import { Country, State, City } from "country-state-city";
import React, { useState, useEffect } from "react";
// import axios from 'axios';
import { useLocation } from "react-router-dom";
// import { heIL } from "@mui/x-data-grid";
// import { Height } from "@mui/icons-material";

// const { Text } = Typography;

const OrganizationDetails = () => {
  // const [form] = Form.useForm();
  // const [isLoading, setIsLoading] = useState(false);
  // const [editMode, setEditMode] = useState(false);
  // const [originalBranch, setOriginalBranch] = useState(null);
  const [branchesData, setBranchesData] = useState([]);
  // const [editingBranchIndex, setEditingBranchIndex] = useState(null); // <--- NEW
  // const [branchEdits, setBranchEdits] = useState({}); // <--- NEW
  // const Navigate = useNavigate();
  const location = useLocation();
  // const countries = Country.getAllCountries();

  // Get initial data from navigation (organization.jsx sends via state)
  const ticket = location.state?.ticket || {};

  // Single branch state
  // const [branch, setBranch] = useState({
  //   orgid: ticket.id || "",
  //   organizationname: ticket.name || "",
  //   branchtype: ticket.branchtype || "",
  //   branch: ticket.brachname || "",
  //   email: ticket.email || "",
  //   phoneCode: ticket.phonecode || "",
  //   phoneno: ticket.mobile || "",
  //   address: ticket.address || "",
  //   city: ticket.district || "",
  //   province: ticket.state || "",
  //   country: ticket.country || "",
  //   postcode: ticket.postalcode || "",
  //   passwords: ticket.passwords || "",
  // });

  // For country/state/city select sync
  // const getStates = (countryName) => {
  //   const country = countries.find(c => c.name === countryName);
  //   return country ? State.getStatesOfCountry(country.isoCode) : [];
  // };
  // const getCities = (countryName, stateName) => {
  //   const country = countries.find(c => c.name === countryName);
  //   const state = country ? State.getStatesOfCountry(country.isoCode).find(s => s.name === stateName) : null;
  //   return (country && state) ? City.getCitiesOfState(country.isoCode, state.isoCode) : [];
  // };

  // Fetch all branches for this organization (full objects)
  useEffect(() => {
    const fetchGetAllData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/getOrganizationBranchesByOrgid/${ticket.id}`);
        const data = await response.json();
        if (response.ok && Array.isArray(data.rows)) {
          setBranchesData(data.rows); // full branch objects
        } else {
          setBranchesData([]);
        }
      } catch (error) {
        setBranchesData([]);
        console.error("Error fetching tickets:", error);
      }
    };
    fetchGetAllData();
  }, [ticket.id]);

  // Sync form fields with branch state
  // useEffect(() => {
  //   form.setFieldsValue(branch);
  // }, [branch, form]);

  // Sort branches: Parent first, then others
  const sortedBranches = [...branchesData].sort((a, b) => {
    if (a.branchtype === "Parent") return -1;
    if (b.branchtype === "Parent") return 1;
    return 0;
  });

  // Handle edit for a branch
  // const handleBranchEdit = (idx) => {
  //   setEditingBranchIndex(idx);
  //   setBranchEdits({ ...sortedBranches[idx] });
  // };

  // Handle cancel for a branch
  // const handleBranchCancel = () => {
  //   setEditingBranchIndex(null);
  //   setBranchEdits({});
  // };

  // Handle save for a branch
  // const handleBranchSave = async (idx) => {
  //   setIsLoading(true);
  //   try {
  //     const payload = { ...branchEdits }; // branchEdits should include id
  //     await axios.post(
  //       'http://localhost:8080/api/v1/UpdateOrganizationDetails',
  //       payload,
  //       { headers: { "Content-Type": "application/json" } }
  //     );
  //     // Update local state
  //     const updated = [...branchesData];
  //     // Find the correct branch in the original array (not sorted)
  //     const originalIdx = branchesData.findIndex(b => b.id === branchEdits.id);
  //     if (originalIdx !== -1) updated[originalIdx] = { ...branchEdits };
  //     setBranchesData(updated);
  //     setEditingBranchIndex(null);
  //     setBranchEdits({});
  //     message.success('Branch updated successfully!');
  //   } catch (error) {
  //     message.error('Error updating branch');
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Handle input change for a branch
  // const handleBranchInputChange = (field, value) => {
  //   setBranchEdits(prev => ({ ...prev, [field]: value }));
  // };

  return (
    <>
              {/* {isLoading && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              color: '#fff',
              fontSize: '20px',
            }}>
              <Spin size="large" fullscreen  />

            </div>
          )} */}
      {/* ...your main organization form here... */}

      {/* Branches Accordion */}
      <Box mt={4} style={{ padding: "16px", backgroundColor: "#ffffff", borderRadius: "8px", height: "100%" }}>
        <Typography.Title level={5} style={{ margin: "16px 0 8px 0" }}>
          Branches
        </Typography.Title>
<Collapse
  accordion
  defaultActiveKey={
    sortedBranches.length > 0
      ? String(sortedBranches.findIndex(b => b.branchtype === "Parent"))
      : undefined
  }
>
  {sortedBranches.map((branch, idx) => (
    <Collapse.Panel header={`${branch.branch} (${branch.branchtype})`} key={branch.id || idx}>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Typography.Text strong>Organization Name</Typography.Text>
          <Input
            value={branch.organizationname}
            placeholder="Organization Name"
            size="large"
            disabled
            style={{ marginBottom: 12 }}
          />
        </Col>
        <Col xs={24} md={8}>
          <Typography.Text strong>Branch Type</Typography.Text>
          <Input
            value={branch.branchtype}
            placeholder="Branch Type"
            size="large"
            disabled
            style={{ marginBottom: 12 }}
          />
        </Col>
        <Col xs={24} md={8}>
          <Typography.Text strong>Branch Name</Typography.Text>
          <Input
            value={branch.branch}
            placeholder="Branch Name"
            size="large"
            disabled
            style={{ marginBottom: 12 }}
          />
        </Col>
        <Col xs={24} md={8}>
          <Typography.Text strong>Phone Code</Typography.Text>
          <Input
            value={branch.phonecode}
            placeholder="Phone Code"
            size="large"
            disabled
            style={{ marginBottom: 12 }}
          />
        </Col>
        <Col xs={24} md={8}>
          <Typography.Text strong>Mobile</Typography.Text>
          <Input
            value={branch.mobile}
            placeholder="Mobile"
            size="large"
            disabled
            style={{ marginBottom: 12 }}
          />
        </Col>
        <Col xs={24} md={8}>
          <Typography.Text strong>Email</Typography.Text>
          <Input
            value={branch.email}
            placeholder="Email"
            size="large"
            disabled
            style={{ marginBottom: 12 }}
          />
        </Col>
        <Col xs={24} md={8}>
          <Typography.Text strong>Country</Typography.Text>
          <Input
            value={branch.country}
            placeholder="Country"
            size="large"
            disabled
            style={{ marginBottom: 12 }}
          />
        </Col>
        <Col xs={24} md={8}>
          <Typography.Text strong>State</Typography.Text>
          <Input
            value={branch.state}
            placeholder="State"
            size="large"
            disabled
            style={{ marginBottom: 12 }}
          />
        </Col>
        <Col xs={24} md={8}>
          <Typography.Text strong>District</Typography.Text>
          <Input
            value={branch.district}
            placeholder="District"
            size="large"
            disabled
            style={{ marginBottom: 12 }}
          />
        </Col>
        <Col xs={24} md={8}>
          <Typography.Text strong>Address</Typography.Text>
          <Input
            value={branch.address}
            placeholder="Address"
            size="large"
            disabled
            style={{ marginBottom: 12 }}
          />
        </Col>
        <Col xs={24} md={8}>
          <Typography.Text strong>Postal Code</Typography.Text>
          <Input
            value={branch.postalcode}
            placeholder="Postal Code"
            size="large"
            disabled
            style={{ marginBottom: 12 }}
          />
        </Col>
        <Col xs={24} md={8}>
          <Typography.Text strong>Date</Typography.Text>
          <Input
            value={branch.date}
            disabled
            size="large"
            style={{ marginBottom: 12 }}
          />
        </Col>
        <Col xs={24} md={8}>
          <Typography.Text strong>Time</Typography.Text>
          <Input
            value={branch.time}
            disabled
            size="large"
            style={{ marginBottom: 12 }}
          />
        </Col>
      </Row>
    </Collapse.Panel>
  ))}
</Collapse>
    {/* <Button
      type="primary"
      onClick={() => {
        Navigate("/organizationadd", {
          state: {
            organizationid: ticket.id,
            organizationname: ticket.name,
          },
        });
      }}
      style={{ marginTop: 16, backgroundColor: "#3e4396", color: "#fff", fontWeight: "bold" }}
    >
      Create New Branch
    </Button> */}
      </Box>
    </>
  );
};

export default OrganizationDetails;