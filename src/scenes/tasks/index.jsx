import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// import { date } from "yup";

const initialTickets = [
  { id: 1, name: "Charan Palemala", status: "Pending", description: "this is not available", priority: "Urgent", ticketraise: "create a ticket", taskid : "1", date:"03-04-2025", time: "10:00 AM" },
  { id: 2, name: "Charan Palemala", status: "Pending", description: "this is not available", priority: "Urgent", ticketraise: "create a ticket",   taskid : "2", date:"03-04-2025", time: "10:00 AM" },
  { id: 3, name: "Charan Palemala", status: "Pending", description: "this is not available", priority: "Urgent", ticketraise: "create a ticket",   taskid : "3", date:"03-04-2025", time: "10:00 AM" },
  { id: 4, name: "Charan Palemala", status: "Pending", description: "this is not available", priority: "Urgent", ticketraise: "create a ticket",  taskid : "4", date:"03-04-2025", time: "10:00 AM" },
  { id: 5, name: "Charan Palemala", status: "Pending", description: "this is not available", priority: "Urgent", ticketraise: "create a ticket",  taskid : "5", date:"03-04-2025", time: "10:00 AM" },
  { id: 6, name: "Charan Palemala", status: "Pending", description: "this is not available", priority: "Urgent", ticketraise: "create a ticket",  taskid : "6", date:"03-04-2025", time: "10:00 AM" },
  { id: 7, name: "Charan Palemala", status: "Pending", description: "this is not available", priority: "Urgent", ticketraise: "create a ticket",  taskid : "7", date:"03-04-2025", time: "10:00 AM" },
  { id: 8, name: "Charan Palemala", status: "Pending", description: "this is not available", priority: "Urgent", ticketraise: "create a ticket", taskid : "8", date:"03-04-2025", time: "10:00 AM" },
  { id: 9, name: "Charan Palemala", status: "Pending", description: "this is not available", priority: "Urgent", ticketraise: "create a ticket",   taskid : "9", date:"03-04-2025", time: "10:00 AM" },

];

const Tasks = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleNewTicket = () => {
    navigate('/taskform');
  };

  const handleRowClick = (params) => {
    navigate('/taskdetails', { state: { ticket: params.row } });
  };

  const handleCompleteTask = (id) => (event) => {
    event.stopPropagation();
    console.log("Task completed:", id);
    // Add your complete task logic here
  };

  const handleDeleteTask = (id) => (event) => {
    event.stopPropagation();
    console.log("Task deleted:", id);
    // Add your delete task logic here
  };

  // Columns for DataGrid
  const columns = [
    { field: "id", headerName: "ID", flex: 0.4, headerClassName: "bold-header", disableColumnMenu: false, minWidth: 100 },
    { field: "ticketraise", headerName: "Task name", flex: 1, headerClassName: "bold-header", disableColumnMenu: true, minWidth: 200 },
    { field: "name", headerName: "Task owner", flex: 1, headerClassName: "bold-header", disableColumnMenu: true, minWidth: 150 },
    { field: "status", headerName: "Status", flex: 1, headerClassName: "bold-header", disableColumnMenu: true, minWidth: 150 },
    { 
      field: "actions", 
      headerName: "Action", 
      flex: 1, 
      headerClassName: "bold-header", 
      disableColumnMenu: true, 
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            onClick={handleCompleteTask(params.id)}
            sx={{ color: "#ffffff", backgroundColor: "#0BDA51",  width: "30px", height: "30px"  }}
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

  return (
    <Box m="10px">
      {/* Toolbar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mb={2} flexDirection={isMobile ? "column" : "row"}>
        {/* Search Bar */}
        <Box display="flex" backgroundColor="#ffffff" borderRadius="3px" flex={1}>
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" value={searchTerm} onChange={handleSearchChange} />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>

        <Button
          variant="contained"
          sx={{
            background: colors.blueAccent[500],
            fontWeight: "bold",
            color: "#ffffff",
            whiteSpace: "nowrap",
            textTransform: "none"
          }}
          startIcon={<AddIcon />}
          onClick={handleNewTicket}
        >
          Create New
        </Button>
      </Box>

      {/* DataGrid */}
      <Box height="70vh" m="13px 0 0 0" sx={{
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
            backgroundColor:"#D9EAFD"
          },
        },
        "& .MuiDataGrid-row": {
          borderBottom: `0.5px solid ${colors.grey[300]}`,
          "&:hover": {
            cursor: "pointer",
            backgroundColor:"#D9EAFD"
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
      }}>
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
              backgroundColor:"#D9EAFD"
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
              backgroundColor:"#D9EAFD"
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
          rows={initialTickets}
          columns={columns}
          pageSize={10}
          onRowClick={handleRowClick}
        />
      </Box>
    </Box>
  );
};

export default Tasks;