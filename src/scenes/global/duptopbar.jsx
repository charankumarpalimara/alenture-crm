import { Box, IconButton, useTheme, Typography, useMediaQuery, Modal } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { Link, useLocation } from "react-router-dom";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
// import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
// import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
// import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import logoLight from "./logo.png";
import logoDark from "./logo2.png";
import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

const MenuItemComponent = ({ title, to, icon, selected, setSelected, closeDrawer }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isActive = selected === to;

  return (
<Link
  to={to}
  style={{ textDecoration: "none", width: "100%" }}
  onClick={() => {
    setSelected(to);
    localStorage.setItem("selectedSidebarItem", to);
    closeDrawer();
  }}
>
  <Box
    display="flex"
    alignItems="center"
    sx={{
      padding: "12px 16px",
      cursor: "pointer",
      color: isActive ? "#fff" : colors.grey[100],
      backgroundColor: isActive ? colors.blueAccent[700] : "inherit",
      width:"100%",
      "&:hover": { backgroundColor: colors.grey[800],  },
    }}
  >
    <Box sx={{ color: isActive ? "#fff" : "inherit" }}>{icon}</Box>
    <Typography sx={{ marginLeft: 2, color: "inherit" }}>{title}</Typography>
  </Box>
</Link>
  );
};

const Topbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const colors = tokens(theme.palette.mode);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);
  const navigate = useNavigate();

  useEffect(() => {
    setSelected(location.pathname);
    sessionStorage.setItem("selectedSidebarItem", location.pathname);
  }, [location.pathname]);

  const logoSrc = theme.palette.mode === "dark" ? logoDark : logoLight;

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" padding={2} sx={{ overflowX: "hidden", background:colors.primary[400] }}>
      <Box display="flex" alignItems="center" flexShrink={0}>
        {isMobile ? (
        <Box sx={{ maxWidth: "180px", height: "50px" }}>
          <img src={logoSrc} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </Box>
        ) : (
          <Box backgroundColor={colors.primary[400]} borderRadius="3px">
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" type="hidden" />
        </Box>
        ) }
      </Box>
      <Box display="flex" alignItems="center" flexShrink={0}>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
        <IconButton onClick={() => navigate("profile")}>
          <PersonOutlinedIcon />
        </IconButton>
        {isMobile && (
          <IconButton onClick={() => setIsModalOpen(true)}>
            <MenuOutlinedIcon />
          </IconButton>
        )}
      </Box>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <Box
    width="250px"
    sx={{
      background: colors.primary[400],
      height: "100vh",
      position: "absolute",
      left: 0,
      top: 0,
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      // justifyContent: "center", // Ensures items are adjusted within the modal
      alignItems: "flex-start",
      overflow: "hidden", // Prevents scrolling
    }}
  >
    <MenuItemComponent title="Dashboard" to="/" icon={<HomeOutlinedIcon />} selected={selected} setSelected={setSelected} closeDrawer={() => setIsModalOpen(false)} />
    <MenuItemComponent title="Experience" to="/allExperiences" icon={<WorkOutlineOutlinedIcon />} selected={selected} setSelected={setSelected} closeDrawer={() => setIsModalOpen(false)} />
    {/* <MenuItemComponent title={<Typography>Customer Relationship <br /> Manager</Typography>} to="/crm" icon={<HandshakeOutlinedIcon />} selected={selected} setSelected={setSelected} closeDrawer={() => setIsModalOpen(false)} />
    <MenuItemComponent title="Head of the Business" to="/hob" icon={<BusinessOutlinedIcon />} selected={selected} setSelected={setSelected} closeDrawer={() => setIsModalOpen(false)} />
    <MenuItemComponent title="Calendar" to="/calendar" icon={<CalendarTodayOutlinedIcon />} selected={selected} setSelected={setSelected} closeDrawer={() => setIsModalOpen(false)} /> */}
    <MenuItemComponent title="Logout" to="/logout" icon={<LogoutOutlinedIcon />} selected={selected} setSelected={setSelected} closeDrawer={() => setIsModalOpen(false)} />
  </Box>
</Modal>
    </Box>
  );
};

export default Topbar;
