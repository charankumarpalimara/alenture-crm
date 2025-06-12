import { Box, IconButton, useTheme, Typography, useMediaQuery, Modal, Backdrop, ListItem, List, ListItemIcon, ListItemText, Drawer } from "@mui/material";
import { useState, useEffect } from "react";
import { tokens } from "../../theme";
import { Link, useLocation } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
// import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
// import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
// import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import logoLight from "./logo.png";
import { useNavigate } from "react-router-dom";
import Badge from '@mui/material/Badge';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { getCrmId, getCrmName } from "../../config";

// Shared getActivePage function
const getActivePage = (pathname) => {
  if (pathname.includes("/notes")) {
    return "/notes";
  } else if (pathname.includes("/calendar")) {
    return "/calendar";
  } else if (
    pathname.includes("/allExperiences") ||
    pathname.includes("/ticketdetails") ||
    pathname.includes("/profile") ||
    pathname.includes("/newExperiences") ||
    pathname.includes("/pendingExperiences") ||
    pathname.includes("/taskdetails") ||
    pathname.includes("/resolvedExperiences")
  ) {
    return "/"; // Ensure this matches the `to` prop of the Experiences Item
  }
  else if (
    pathname.includes("/cmform") ||
    pathname.includes("/cmdetails") ||
    pathname.includes("/cm")
  ) {
    return "/cm"; // Ensure this matches the `to` prop of the Experiences Item
  }
  else if (
    pathname.includes("/organization") ||
    pathname.includes("/organizationdetails")

  ) {
    return "/organization"; // Ensure this matches the `to` prop of the Experiences Item
  }
  // else if (
  //   pathname.includes("/tasks") ||
  //   pathname.includes("/taskform")
  //   // pathname.includes("/taskdetails")

  // )
  //  {
  //   return "/tasks"; // Ensure this matches the `to` prop of the Experiences Item
  // }
  else if (
    pathname.includes("/tasks") ||
    pathname.includes("/taskform") ||
    pathname.includes("/taskdetails")

  ) {
    return "/tasks"; // Ensure this matches the `to` prop of the Experiences Item
  } else {
    return pathname;
  }
};
// Sidebar Item Component (Reused from Sidebar)
const Item = ({ title, to, icon, selected, setSelected, handleClose }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ListItem
      button
      component={Link}
      to={to}
      selected={selected === to}
      onClick={() => {
        setSelected(to);
        sessionStorage.setItem("selectedSidebarItem", to);
        if (handleClose) handleClose();
      }}
      sx={{
        color: selected === to ? "white" : colors.blueAccent[500],
        fontWeight: selected === to ? "bold" : "regular",
        backgroundColor: selected === to ? colors.blueAccent[700] : "inherit",
        borderRadius: "10px",
        marginBottom: "8px",
        "&:hover": {
          backgroundColor: selected === to ? "#3e4396 !important" : "none", // Ensure no hover effect
          color: selected === to ? "white" : colors.blueAccent[500],
        },
      }}
    >
      <ListItemIcon sx={{ color: "inherit" }}>{icon}</ListItemIcon>
      <ListItemText
        primary={title}
        sx={{
          "& .MuiTypography-root": { // Target the nested Typography component
            fontWeight: "bold !important", // Ensure text is bold for selected item
            fontSize: "15px",
          },
        }}
      />
    </ListItem>
  );
};

const Topbar = ({onLogout}) => {
  // const userDetails = JSON.parse(sessionStorage.getItem('CrmDetails')) || {}; // Use correct key for CRM
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const location = useLocation();
  const [selected, setSelected] = useState(getActivePage(location.pathname));
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // WebSocket connection for live notifications
  useEffect(() => {
  // const WS_URL = "ws://147.182.163.213:3000/ws/";
    const ws = new WebSocket(process.env.REACT_APP_WS_URL);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket data:', data); // Debug incoming messages
        if (data.type === 'notification' && data.crmid === getCrmId()) {
          setNotifications((prev) => [data, ...prev]);
          setUnreadCount((prev) => prev + 1);
          setSnackbarMsg(data.message);
          setSnackbarOpen(true);
        }
      } catch (e) {}
    };
    return () => ws.close();
  }, []);

  const handleNotificationsClick = () => {
    setUnreadCount(0);
    setDrawerOpen(true);
  };

  // Notification dropdown/modal (simple version)
  // const NotificationDropdown = () => (
  //   <Modal open={drawerOpen} onClose={() => setDrawerOpen(false)}>
  //     <Box sx={{ position: 'absolute', top: 80, right: 20, width: 350, bgcolor: 'background.paper', boxShadow: 24, p: 2, borderRadius: 2 }}>
  //       <Typography variant="h6" sx={{ mb: 2 }}>Notifications</Typography>
  //       {notifications.length === 0 ? (
  //         <Typography>No notifications</Typography>
  //       ) : (
  //         notifications.slice(0, 10).map((notif, idx) => (
  //           <Box key={idx} sx={{ mb: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
  //             <Typography variant="subtitle2">{notif.title}</Typography>
  //             <Typography variant="body2">{notif.message}</Typography>
  //             <Typography variant="caption" color="text.secondary">{new Date(notif.timestamp).toLocaleString()}</Typography>
  //           </Box>
  //         ))
  //       )}
  //     </Box>
  //   </Modal>
  // );


  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/cm":
        return "Customer Manager";
      case "/crm":
        return "Customer Relationship Manager";
      case "/hob":
        return "Head of The Business";
      case "/cmform":
        return "Create a New Customer Manager";
      case "/crmform":
        return "Allot New Experience";
      case "/form":
        return "";
      case "/tasks":
        return "Tasks List";
      case "/taskdetails":
        return "Task Details";
      case "/taskform":
        return "Create New Task";
      case "/ticketdetails":
        return " Experience Details";
      case "/cmdetails":
        return "Customer Manager Details";
      case "/allExperiences":
        return "All Experiences";
      case "/organization":
        return "Organization";
      case "/organizationdetails":
        return "Organization Details";
      case "/newExperiences":
        return "New Experiences";
      case "/pendingExperiences":
        return "Pending Experiences";
      case "/resolvedExperiences":
        return "Resolved Experiences";
      case "/profile":
        return "Profile";
      case "/notes":
        return "Notes";
      case "/calendar":
        return "Calendar";
      default:
        return "Page Not Found";
    }
  };
  const getPageTitle1 = () => {
    switch (location.pathname) {
      case "/":
        return { primaryTitle: "Dashboard", secondaryTitle: null };
      case "/cm":
        return { primaryTitle: "Customer Manager", secondaryTitle: null };
      case "/cmdetails":
        return { primaryTitle: "Customer Manager Details ", secondaryTitle: null };
      case "/crm":
        return { primaryTitle: "Experiences", secondaryTitle: null };
      case "/hob":
        return { primaryTitle: "Head of The Business", secondaryTitle: null };
      case "/organization":
        return { primaryTitle: "Organizations", secondaryTitle: null };
      case "/organizationdetails":
        return { primaryTitle: "Organization Details", secondaryTitle: null };
      case "/ticketdetails":
        return { primaryTitle: "Experience Details", secondaryTitle: null };
      case "/tasks":
        return { primaryTitle: "Tasks List", secondaryTitle: null };
      case "/taskform":
        return { primaryTitle: "Tasks List", secondaryTitle: "Create a New Task" };
      case "/taskdetails":
        return { primaryTitle: "Task Details", secondaryTitle: null };
      // case "/cmdetails":
      //   return { primaryTitle: "Customer Manager Details ", secondaryTitle: null };       
      case "/cmform":
        return { primaryTitle: "Customer Manager", secondaryTitle: "Create a New Customer Manager" };
      case "/crmform":
        return { primaryTitle: "Experiences", secondaryTitle: "Allot New Experience" };
      case "/form":
        return { primaryTitle: "Head of the Business", secondaryTitle: "Create a New Head of the Business Unit" };
      case "/allExperiences":
        return { primaryTitle: "Experiences", secondaryTitle: "All Experiences" };
      case "/newExperiences":
        return { primaryTitle: "Experinces", secondaryTitle: "New Experiences" };
      case "/pendingExperiences":
        return { primaryTitle: "Experinces", secondaryTitle: "Pending Experiences" };
      case "/resolvedExperiences":
        return { primaryTitle: "Experinces", secondaryTitle: "Resolved Experiences" };
      case "/profile":
        return { primaryTitle: "Profile", secondaryTitle: null };
      case "/notes":
        return { primaryTitle: "Notes", secondaryTitle: null };
      case "/calendar":
        return { primaryTitle: "Calendar", secondaryTitle: null };
      default:
        return { primaryTitle: "Page Not Found", secondaryTitle: null };
    }
  };


  const { primaryTitle, secondaryTitle } = getPageTitle1();

  // const pageTitle = getPageTitle();
  // const [primaryTitle, secondaryTitle] = pageTitle.includes(" / ") ? pageTitle.split(" / ") : [pageTitle, ""];

  // Sync selected state with sessionStorage
  useEffect(() => {
    const storedSelected = sessionStorage.getItem("selectedSidebarItem");
    if (storedSelected) {
      setSelected(storedSelected);
    }
  }, []);

  useEffect(() => {
    setSelected(getActivePage(location.pathname));
    sessionStorage.setItem("selectedSidebarItem", getActivePage(location.pathname));
  }, [location.pathname]);

  const logoSrc = logoLight;

  // const getGreeting = () => {
  //   const hour = new Date().getHours();
  //   if (hour < 12) return "Good Morning";
  //   if (hour < 18) return "Good Afternoon";
  //   return "Good Evening";
  // };
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const CustomDivider = () => (
    <Box sx={{ width: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <FontAwesomeIcon icon={faAngleRight} /> {/* Custom divider icon */}
    </Box>
  );

    const handleLogout = () => { 

    sessionStorage.removeItem('crmtoken');
    onLogout();
    window.location.reload();
    navigate('/login');
  }


  return (
    <Box
      width="100%"
      sx={{
        bgcolor: "#fefefe !important",
        overflowX: "hidden",
      }}
    >
      {/* Topbar Container */}
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        bgcolor="#ffffff"
        sx={{ overflowX: "hidden", flex: 1, marginTop: 1, background: "ffffff", backgroundColor: "#ffffff" }}
      >
        {/* Header Section */}
        {isMobile && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexShrink={0}
            width="100%"
            sx={{
              bgcolor: "#fefefe !important",
              boxShadow: "0px 4px 4px -2px rgba(0, 0, 0, 0.1)",
              marginBottom: 2,
              padding: 2,
            }}
          >
            {/* Logo on Mobile */}
            <Box sx={{ maxWidth: "180px", height: "50px", backgroundColor: "#fefefe !important" }}>
              <img
                src={logoSrc}
                alt="logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </Box>

            {/* Mobile Menu Icon */}
            <IconButton onClick={() => setIsModalOpen(true)}>
              <MenuOutlinedIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Box>
        )}

        {/* Greeting and Profile Section */}
        {isMobile ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            flexShrink={0}
            sx={{
              bgcolor: "transparent",
              paddingX: isMobile ? 2 : 9,
              paddingY: 1,
              boxShadow: "0px 4px 4px -2px rgba(0, 0, 0, 0.1)",
              padding: 1,
            }}
          >
            {/* Greeting Message */}
            <Box
              borderRadius="3px"
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "fit-content",
                padding: "8px",
                paddingLeft: isMobile ? "12px" : "20px",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              {/* <Typography sx={{ color: "#8d8d8d", fontSize: isMobile ? "30px" : "25px" }}>
                {getGreeting()} Delphin
              </Typography> */}
              <Typography sx={{ color: "#8d8d8d", fontSize: isMobile ? "16px" : "16px" }}>
                {currentTime.toLocaleString("en-US", {
                  month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", hour12: true
                })}
              </Typography>
            </Box>

            {/* Profile Section */}
            <Box
              borderRadius="3px"
              sx={{
                display: "flex",
                width: "fit-content",
                alignItems: "center",
              }}
            >
       <IconButton sx={{ gap: 1 }} onClick={handleNotificationsClick}>
          <Badge badgeContent={unreadCount} color="error">
            <Box
              sx={{
                width: isMobile ? 25 : 30,
                height: isMobile ? 25 : 30,
                borderRadius: "50%",
                backgroundColor: colors.blueAccent[500],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NotificationsIcon sx={{ fontSize: isMobile ? 18 : 20, color: "#fff" }} />
            </Box>
          </Badge>
        </IconButton>
        {/* <NotificationDropdown /> */}
              <IconButton onClick={() => navigate("profile")} sx={{ gap: 1 }}>
                <Box
                  sx={{
                    width: isMobile ? 25 : 30,
                    height: isMobile ? 25 : 30,
                    borderRadius: "50%",
                    backgroundColor: colors.blueAccent[500],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                 > 
                  <PersonIcon sx={{ fontSize: isMobile ? 18 : 20, color: "#fff" }} />
                </Box>
                <Typography sx={{ color: "#000", fontSize: isMobile ? 15 : 17 }}>
                  {getCrmName()}
                </Typography>
              </IconButton>
              <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="info" sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
            </Box>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            flexShrink={0}
            sx={{
              bgcolor: "#ffffff",
              paddingX: isMobile ? 2 : 4,
              paddingLeft: 35,
            }}
          >
            {/* Greeting Message */}
            <Box
              borderRadius="3px"
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "fit-content",
                padding: "8px",
                paddingRight: "30px",
                paddingLeft: isMobile ? "12px" : "20px",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              {/* <Typography sx={{ color: "#8d8d8d", fontSize: isMobile ? "20px" : "25px" }}>
                {getGreeting()} Delphin
              </Typography> */}
              <Typography sx={{ color: "#8d8d8d", fontSize: isMobile ? "14px" : "16px" }}>
                {currentTime.toLocaleString("en-US", {
                  month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", hour12: true
                })}
              </Typography>
            </Box>

            {/* Profile Section */}
            <Box
              borderRadius="3px"
              sx={{
                display: "flex",
                width: "fit-content",
                alignItems: "center",
              }}
            >
       <IconButton sx={{ gap: 1 }} onClick={handleNotificationsClick}>
          <Badge badgeContent={unreadCount} color="error">
            <Box
              sx={{
                width: isMobile ? 25 : 30,
                height: isMobile ? 25 : 30,
                borderRadius: "50%",
                backgroundColor: colors.blueAccent[500],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NotificationsIcon sx={{ fontSize: isMobile ? 18 : 20, color: "#fff" }} />
            </Box>
          </Badge>
        </IconButton>
              <IconButton onClick={() => navigate("profile")} sx={{ gap: 1 }}>
                <Box
                  sx={{
                    width: isMobile ? 25 : 30,
                    height: isMobile ? 25 : 30,
                    borderRadius: "50%",
                    backgroundColor: colors.blueAccent[500],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PersonIcon sx={{ fontSize: isMobile ? 18 : 20, color: "#fff" }} />
                </Box>
                <Typography sx={{ color: "#000", fontSize: isMobile ? 15 : 17 }}>
                 {getCrmName()}
                </Typography>
              </IconButton>
            </Box>
          </Box>
        )}

        {/* Page Title Section */}
        {isMobile ? (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            flexShrink={0}
            sx={{
              backgroundColor: colors.blueAccent[700],
              paddingX: isMobile ? 2 : 4,
              boxShadow: "0px 4px 8px -2px rgba(62, 67, 150, 0.5)",
              padding: "20px",
            }}
          >
            {/* Greeting Message */}
            <Box
              borderRadius="3px"
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "fit-content",
                padding: "8px",
                paddingLeft: isMobile ? "12px" : "20px",
                textAlign: isMobile ? "text" : "text",
              }}
            >
              <Typography sx={{ color: "#ffffff", fontSize: isMobile ? "20px" : "20px", fontWeight: "bold" }}>
                {getPageTitle()}
              </Typography>
              <Box sx={{ color: "#ffffff", alignItems: "center", gap: 1, display: "flex" }}>
                <HomeOutlinedIcon
                  onClick={() => navigate("/")}
                  fontSize="small"
                  sx={{ cursor: "pointer" }}
                />

                <CustomDivider />
                <Typography>{getPageTitle()}</Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            flexShrink={0}
            sx={{
              backgroundColor: colors.blueAccent[500],
              paddingX: isMobile ? 2 : 4,
              paddingLeft: 35,
            }}
          >
            {/* Greeting Message */}
            <Box
              borderRadius="3px"
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "fit-content",
                padding: "8px",
                paddingLeft: isMobile ? "12px" : "20px",
              }}
            >
              <Typography sx={{ color: "#ffffff", fontSize: isMobile ? "17px" : "20px", fontWeight: "bold" }}>
                {primaryTitle}
              </Typography>
              <Box sx={{ color: "#ffffff", alignItems: "center", gap: 1, display: "flex" }}>
                <HomeOutlinedIcon onClick={() => navigate("/")} fontSize="small" sx={{ cursor: "pointer" }} />
                <CustomDivider />
                <Typography sx={{ cursor: "pointer", fontSize: "14px" }} onClick={ secondaryTitle ? () => navigate(-1) : undefined}>
                  {primaryTitle}
                </Typography>
                {secondaryTitle && (
                  <>
                    <CustomDivider />
                    <Typography sx={{ cursor: "pointer", fontSize: "14px" }} onClick={() => navigate(location.pathname)}>
                      {secondaryTitle}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <Box sx={{ alignItems: "center" }}>
        {/* Mobile Sidebar Modal */}
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
            sx: { backgroundColor: "rgba(0, 0, 0, 0.5)" }, // Semi-transparent black backdrop
          }}
        >
          <Box
            width="100%"
            sx={{
              background: colors.primary[400],
              height: "100vh",
              position: "absolute",
              left: 0,
              top: "10%",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              overflow: "hidden",
              boxShadow: "4px 0px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Item title="Dashboard" to="/" icon={<HomeOutlinedIcon />} selected={selected} setSelected={setSelected} handleClose={() => setIsModalOpen(false)} />
            <Item title="Customer Manager" to="/cm" icon={<WorkOutlineOutlinedIcon />} selected={selected} setSelected={setSelected} handleClose={() => setIsModalOpen(false)} />
            <Item title="Organization" to="/organization" icon={<BusinessOutlinedIcon />} selected={selected} setSelected={setSelected} handleClose={() => setIsModalOpen(false)} />
            {/* <Item title="Tasks" to="/tasks" icon={<TaskOutlinedIcon />} selected={selected} setSelected={setSelected} handleClose={() => setIsModalOpen(false)} /> */}
            <Item title="Notes" to="/notes" icon={<DescriptionOutlinedIcon />} selected={selected} setSelected={setSelected} handleClose={() => setIsModalOpen(false)} />
            <Item title="Calendar" to="/calendar" icon={<CalendarTodayOutlinedIcon />} selected={selected} setSelected={setSelected} handleClose={() => setIsModalOpen(false)} />
  <ListItem
            button
            onClick={handleLogout}
            sx={{
              color: colors.blueAccent[500],
              borderRadius: "10px",
              marginBottom: "8px",
              "&:hover": {
                backgroundColor: colors.blueAccent[700],
                color: "white",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <LogoutOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{
                "& .MuiTypography-root": {
                  fontWeight: "bold !important",
                  fontSize: "15px",
                },
              }}
            />
          </ListItem>

          </Box>
        </Modal>
      </Box>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: isMobile ? 250 : 350, padding: 2 }} role="presentation">
          <Typography variant="h6" sx={{ mb: 2 }}>
            Notifications
          </Typography>
          <List>
            {notifications.length === 0 && (
              <ListItem>
                <ListItemText primary="No notifications yet." />
              </ListItem>
            )}
            {notifications.map((notif, idx) => (
              <ListItem key={idx} divider>
                <ListItemText
                  primary={notif.title || "Notification"}
                  secondary={
                    <>
                      <span>{notif.message}</span>
                      <br />
                      <span style={{ fontSize: 12, color: "#888" }}>
                        {notif.timestamp ? new Date(notif.timestamp).toLocaleString() : ""}
                      </span>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Topbar;