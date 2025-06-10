import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  useTheme,
  useMediaQuery,
  MenuItem,
  Menu,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ImportExport as ImportExportIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Initial ticket data
const initialTickets = [
  { id: 1, subject: "Issue A", priority: "High", status: "Open", date: "2024-03-19", updated: "2 hours ago", },
  { id: 2, subject: "Issue B", priority: "Low", status: "Closed", date: "2024-03-18", updated: "2 hours ago", },
  { id: 3, subject: "Issue C", priority: "Medium", status: "In Progress", date: "2024-03-17", updated: "2 hours ago", },
  { id: 4, subject: "Issue A", priority: "High", status: "Open", date: "2024-03-19", updated: "2 hours ago", },
  { id: 5, subject: "Issue B", priority: "Low", status: "Closed", date: "2024-03-18", updated: "2 hours ago", },
  { id: 6, subject: "Issue C", priority: "Medium", status: "In Progress", date: "2024-03-17", updated: "2 hours ago", },
  { id: 7, subject: "Issue A", priority: "High", status: "Open", date: "2024-03-19", updated: "2 hours ago", },
  { id: 8, subject: "Issue B", priority: "Low", status: "Closed", date: "2024-03-18", updated: "2 hours ago", },
  { id: 9, subject: "Issue C", priority: "Medium", status: "In Progress", date: "2024-03-17", updated: "2 hours ago", },
  { id: 10, subject: "Issue A", priority: "High", status: "Open", date: "2024-03-19", updated: "2 hours ago", },
  { id: 11, subject: "Issue B", priority: "Low", status: "Closed", date: "2024-03-18", updated: "2 hours ago", },
  { id: 12, subject: "Issue C", priority: "Medium", status: "In Progress", date: "2024-03-17", updated: "2 hours ago", },
  { id: 13, subject: "Issue A", priority: "High", status: "Open", date: "2024-03-19", updated: "2 hours ago", },
  { id: 14, subject: "Issue B", priority: "Low", status: "Closed", date: "2024-03-18", updated: "2 hours ago", },
  { id: 15, subject: "Issue C", priority: "Medium", status: "In Progress", date: "2024-03-17", updated: "2 hours ago", },
];

// Columns for DataGrid
const columns = [
  { field: "id", headerName: "ID", flex: 0.4, headerClassName: "bold-header", disableColumnMenu: false, minWidth: 100 },
  { field: "subject", headerName: "Subject", flex: 2, headerClassName: "bold-header", disableColumnMenu: true, minWidth: 200 },
  { field: "priority", headerName: "Priority", flex: 1, headerClassName: "bold-header", disableColumnMenu: true, minWidth: 150 },
  { field: "status", headerName: "Status", flex: 1, headerClassName: "bold-header", disableColumnMenu: true, minWidth: 150 },
  { field: "date", headerName: "Created", flex: 1, headerClassName: "bold-header", disableColumnMenu: true, minWidth: 150 },
  { field: "updated", headerName: "Updated", flex: 1, headerClassName: "bold-header", disableColumnMenu: true, minWidth: 150 },
];

const Crm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 600px)");
    const Navigate = useNavigate();

  // State for tickets
  const [tickets] = useState(initialTickets); // Removed setTickets since it's unused
  const [filteredTickets, setFilteredTickets] = useState(initialTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({ priority: [], status: [] });

  // Search filter
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    applyFilters(event.target.value, selectedFilters);
  };

  // Open & Close Filter Menu
  const handleFilterClick = (event) => setFilterAnchorEl(event.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);

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
      filtered = filtered.filter((ticket) => filters.priority.includes(ticket.priority));
    }
    if (filters.status.length) {
      filtered = filtered.filter((ticket) => filters.status.includes(ticket.status));
    }
    setFilteredTickets(filtered);
  };

  const handleNewTicket = () => {
    Navigate('/crmform')
  };
  // Get Unique Values for Filters
  const getUniqueValues = (key) => [...new Set(tickets.map((ticket) => ticket[key]))];

  return (
    <Box m="20px">
      {/* Toolbar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mb={2} flexDirection={isMobile ? "column" : "row"}>
        {/* Search Bar */}
        <Box display="flex" backgroundColor="#ffffff" borderRadius="3px" flex={1}>
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" value={searchTerm} onChange={handleSearchChange} />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Export Button */}
        <Button 
         sx={{
          backgroundColor: colors.blueAccent[500],
          color: "#ffffff",
          whiteSpace: "nowrap",
          fontWeight: "bold",
            textTransform:"none"
        }}
          variant="contained" 
          startIcon={<ImportExportIcon />} 
          onClick={() => alert("Export Data!")}
        >
          Export
        </Button>

        {/* Filter Button */}
        <Button           
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
        </Button>

        {/* Filter Menu */}
        <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
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
        </Menu>
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
                      textTransform:"none"
                    }}
                    startIcon={<AddIcon />}
                    onClick={handleNewTicket}
                  >
                    New Experience
                  </Button>
      </Box>

      {/* DataGrid */}
      <Box height="70vh"
        m="13px 0 0 0"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            overflowX: "auto", // Enable horizontal scrolling
          },
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
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold !important", // Ensure header text is bold
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#ffffff",
          },
          "& .MuiDataGrid-row": {
            borderBottom: `0.5px solid ${colors.grey[300]}`, // Add border to the bottom of each row
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
        }}>
        <DataGrid
          rows={filteredTickets}
          columns={columns}
          pageSize={10}
        />
      </Box>
    </Box>
  );
};

export default Crm;
