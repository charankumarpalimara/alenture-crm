import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  useTheme,
  useMediaQuery,
  // MenuItem,
  // Menu,
  // Typography,
  // Checkbox,
  // FormControlLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {
  Search as SearchIcon,
  // FilterList as FilterIcon,
  // ImportExport as ImportExportIcon,
  Add as AddIcon,
  // PasswordSharp,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Initial ticket data
// const initialTickets = [
//   { id: 1, name: "Charan Palemala", email: "charan@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode:"+91", customermanager:"RamBabu", organization: "Wipro" },
//   { id: 2, name: "Satya Narayana", email: "Satya@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode: "+91", customermanager: "RamBabu", organization: "Infosys" },
//   { id: 3, name: "Rambabu bade", email: "john@gmail.com", phone: "1234567890", city: "New York", created: "15th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode:"+91", customermanager:"RamBabu", organization: "TCS" },
//   { id: 4, name: "Charan Palemala", email: "charan@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode:"+91", customermanager:"RamBabu", organization: "HCL" },
//   { id: 5, name: "Satya Narayana", email: "Satya@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode:"+91", customermanager:"RamBabu", organization: "Tech Mahindra" },
//   { id: 6, name: "John Doe", email: "john@gmail.com", phone: "1234567890", city: "New York", created: "15th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode:"+91", customermanager:"RamBabu", Organization: "HCL" },
//   { id: 7, name: "Charan Palemala", email: "charan@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode:"+91", customermanager:"RamBabu", organization: "Infosys" },
//   { id: 8, name: "Satya Narayana", email: "Satya@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode:"+91", customermanager:"RamBabu", organization: "Wipro" },
//   { id: 9, name: "John Doe", email: "john@gmail.com", phone: "1234567890", city: "New York", created: "15th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode:"+91", customermanager:"RamBabu", organization: "TCS" },
// ];

// Columns for DataGrid (adjusted to match backend fields)
const columns = [
  {
    field: "cmid",
    headerName: "ID",
    flex: 0.4,
    headerClassName: "bold-header",
    disableColumnMenu: false,
    minWidth: 100,
  },
  {
    field: "cmname",
    headerName: "Name",
    flex: 0.4,
    headerClassName: "bold-header",
    disableColumnMenu: true,
    minWidth: 200,
  },
  {
    field: "organizationid",
    headerName: "Organization ID",
    flex: 1,
    headerClassName: "bold-header",
    disableColumnMenu: true,
    minWidth: 150,
  },
  {
    field: "organizationname",
    headerName: "Organization Name",
    flex: 1,
    headerClassName: "bold-header",
    disableColumnMenu: true,
    minWidth: 150,
  },
  {
    field: "branch",
    headerName: "Branch",
    flex: 1,
    headerClassName: "bold-header",
    disableColumnMenu: true,
    minWidth: 150,
  },
  {
    field: "created",
    headerName: "Created",
    flex: 1,
    headerClassName: "bold-header",
    disableColumnMenu: true,
    minWidth: 150,
  },
];

const Cm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const Navigate = useNavigate();

  // State for tickets
  // const [tickets] = useState(initialTickets); // Removed setTickets since it's unused
  // const [filteredTickets, setFilteredTickets] = useState(initialTickets);
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTickets, setFilteredTickets] = useState([]);
  //  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  //  const [selectedFilters, setSelectedFilters] = useState({ priority: [], status: [] });
  // const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  // const [selectedFilters, setSelectedFilters] = useState({ priority: [], status: [] });

  useEffect(() => {
    const fetchRelations = async () => {
      try {
        const userDetails =
          JSON.parse(sessionStorage.getItem("CrmDetails")) || {};
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getRelationByCrmId/${userDetails.crmid}`
        );
        const result = await response.json();

        const mapped = (Array.isArray(result.data) ? result.data : []).map(
          (item, idx) => ({
            id: item.id || idx,
            cmid: item.cmid || "",
            cmname: item.cmname || "",
            organizationid: item.organizationid || "",
            organizationname: item.organizationname || "",
            branch: item.branch || "",
            created: item.date || "",
            // Flatten cmDetails fields
            firstname: item.cmDetails?.firstname || "",
            lastname: item.cmDetails?.lastname || "",
            email: item.cmDetails?.email || "",
            phonecode: item.cmDetails?.phonecode || "",
            mobile: item.cmDetails?.mobile || "",
            gender: item.cmDetails?.extraind2 || "",
            status: item.cmDetails?.extraind3 || "",
            imageUrl: item.cmDetails?.imageUrl || "",
            Passwords: item.cmDetails?.passwords || "",
          })
        );

        setTickets(mapped);
        setFilteredTickets(mapped);
      } catch (error) {
        setTickets([]);
        setFilteredTickets([]);
        console.error("Error fetching CRM relations:", error);
      }
    };
    fetchRelations();
  }, []);

  // Search filter
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // applyFilters(event.target.value, selectedFilters);
  };

  // Open & Close Filter Menu
  // const handleFilterClick = (event) => setFilterAnchorEl(event.currentTarget);
  // const handleFilterClose = () => setFilterAnchorEl(null);

  // Handle Filter Selection
  // const handleFilterSelect = (filterType, value) => {
  //   setSelectedFilters((prev) => {
  //     const updatedFilters = { ...prev };
  //     updatedFilters[filterType] = updatedFilters[filterType].includes(value)
  //       ? updatedFilters[filterType].filter((item) => item !== value)
  //       : [...updatedFilters[filterType], value];
  //     applyFilters(searchTerm, updatedFilters);
  //     return updatedFilters;
  //   });
  // };

  // Apply Filters
  // const applyFilters = (search, filters) => {
  //   let filtered = tickets;
  //   if (search.trim()) {
  //     filtered = filtered.filter((ticket) =>
  //       Object.values(ticket).some((value) =>
  //         String(value).toLowerCase().includes(search.toLowerCase())
  //       )
  //     );
  //   }
  //   if (filters.priority.length) {
  //     filtered = filtered.filter((ticket) => filters.priority.includes(ticket.priority));
  //   }
  //   if (filters.status.length) {
  //     filtered = filtered.filter((ticket) => filters.status.includes(ticket.status));
  //   }
  //   setFilteredTickets(filtered);
  // };

  const handleNewTicket = () => {
    Navigate("/crm/cmform");
  };

  const handleRowClick = (params) => {
    Navigate("/crm/cmdetails", { state: { ticket: params.row } });
  };
  // Get Unique Values for Filters
  // const getUniqueValues = (key) => [...new Set(tickets.map((ticket) => ticket[key]))];

  return (
    <Box m="10px">
      {/* Toolbar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={2}
        flexDirection={isMobile ? "column" : "row"}
      >
        {/* Search Bar */}
        <Box
          display="flex"
          backgroundColor="#ffffff"
          borderRadius="3px"
          flex={1}
        >
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Export Button */}
        {/* <Button 
         sx={{
          backgroundColor: colors.blueAccent[500],
          color: "#ffffff",
          whiteSpace: "nowrap",
          fontWeight: "bold",
        }}
          variant="contained" 
          startIcon={<ImportExportIcon />} 
          onClick={() => alert("Export Data!")}
        >
          Export
        </Button> */}

        {/* Filter Button */}
        {/* <Button           
                  sx={{
                    backgroundColor: colors.blueAccent[500],
                    color: "#ffffff",
                    whiteSpace: "nowrap",
                    fontWeight: "bold",
                      textTransform:"none"
                  }}
          variant="contained" 
          startIcon={<FilterIcon />} 
          onClick={handleFilterClick}
        >
          Filter
        </Button> */}
        <Button
          variant="contained"
          sx={{
            background: colors.blueAccent[500],
            fontWeight: "bold",
            color: "#ffffff",
            whiteSpace: "nowrap",
            // paddingX: "15px"
            // padding: "12px 18px ",
            // fontSize: "14px",
            textTransform: "none",
          }}
          startIcon={<AddIcon />}
          onClick={handleNewTicket}
        >
          Create New
        </Button>

        {/* Filter Menu */}
        {/* <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
          <Box p={2}>
            <Typography variant="h6">Priority</Typography>
            {getUniqueValues("priority").map((priority) => (
              <MenuItem key={priority}>
                <FormControlLabel
                  control={<Checkbox checked={selectedFilters.priority.includes(priority)} onChange={() => handleFilterSelect("priority", priority)} />}
                  label={priority}
                />
              </MenuItem>
            ))}
          </Box>

          <Box p={2}>
            <Typography variant="h6">Status</Typography>
            {getUniqueValues("status").map((status) => (
              <MenuItem key={status}>
                <FormControlLabel
                  sx={{ backgroundColor: "#ffffff" }}
                  control={<Checkbox checked={selectedFilters.status.includes(status)} onChange={() => handleFilterSelect("status", status)} />}
                  label={status}
                />
              </MenuItem>
            ))}
          </Box>
        </Menu> */}
      </Box>

      {/* DataGrid */}
      <Box
        height="70vh"
        m="13px 0 0 0"
        sx={{
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            fontSize: "16px",
            whiteSpace: "nowrap",
            overflow: "visible",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            fontWeight: "bold !important",
            fontSize: "16px !important",
            color: "#ffffff",
          },
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold !important",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#ffffff",
          },
          "& .MuiDataGrid-root::-webkit-scrollbar": {
            display: "none !important",
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
            display: "none !important",
          },
          "& .MuiDataGrid-root": {
            "&:hover": {
              cursor: "pointer",
              backgroundColor: "#D9EAFD",
            },
          },
          "& .MuiDataGrid-row": {
            borderBottom: `0.5px solid ${colors.grey[300]}`,
            "&:hover": {
              cursor: "pointer",
              backgroundColor: "#D9EAFD",
            },
          },
          "& .MuiTablePagination-root": {
            color: "#ffffff !important",
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-input": {
            color: "#ffffff !important",
          },
          "& .MuiTablePagination-displayedRows": {
            color: "#ffffff !important",
          },
          "& .MuiSvgIcon-root": {
            color: "#ffffff !important",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
            color: "#ffffff",
          },
        }}
      >
        <DataGrid
          sx={{
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
              fontSize: "16px",
              whiteSpace: "nowrap", // Prevent text wrapping
              overflow: "visible", // Prevent text truncation
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none", // Remove the border below the header
              fontWeight: "bold !important",
              fontSize: "16px !important",
              color: "#ffffff",
            },
            // "& .MuiDataGrid-root::-webkit-scrollbar-thumb":{
            //    width: "2px !important",
            //    height: "6px !important"
            //  },
            "& .MuiDataGrid-columnSeparator": {
              display: "none", // Hide the column separator
            },
            // "& .MuiDataGrid-root::-webkit-scrollbar": {
            //   display: "none", // Hides scrollbar in Chrome, Safari
            // },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold !important", // Ensure header text is bold
            },
            // "& .MuiDataGrid-virtualScroller": {
            //   backgroundColor: "#ffffff",
            // },
            "& .MuiDataGrid-root::-webkit-scrollbar": {
              display: "none !important",
            },
            "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
              display: "none !important",
            },
            "& .MuiDataGrid-root": {
              // scrollbarWidth: "none !important", // Hides scrollbar in Firefox
              "&:hover": {
                cursor: "pointer",
                backgroundColor: "#D9EAFD",
              },
            },
            "& .MuiDataGrid-virtualScroller": {
              // scrollbarWidth: "none !important",
              backgroundColor: "#ffffff",
            },
            "& .MuiDataGrid-row": {
              borderBottom: `0.5px solid ${colors.grey[300]}`, // Add border to the bottom of each row
              "&:hover": {
                cursor: "pointer",
                backgroundColor: "#D9EAFD",
              },
            },
            "& .MuiTablePagination-root": {
              color: "#ffffff !important", // Ensure pagination text is white
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-input": {
              color: "#ffffff !important", // Ensure select label and input text are white
            },
            "& .MuiTablePagination-displayedRows": {
              color: "#ffffff !important", // Ensure displayed rows text is white
            },
            "& .MuiSvgIcon-root": {
              color: "#ffffff !important", // Ensure pagination icons are white
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
              color: "#ffffff",
            },
          }}
          rows={filteredTickets.length ? filteredTickets : tickets}
          columns={columns}
          pageSize={10}
          onRowClick={handleRowClick}
        />
      </Box>
    </Box>
  );
};
export default Cm;
