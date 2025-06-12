import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
// import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
// import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
// import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
// import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import logoLight from "./logo.png";
import logoDark from "./logo2.png";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === to}
      style={{
        color: selected === to ? "white" : colors.blueAccent[500],
        fontWeight: selected === to ? "bold" : "regular",
        backgroundColor: selected === to ? colors.blueAccent[700] : "inherit",
      }}
      onClick={() => {
        setSelected(to);
        sessionStorage.setItem("selectedSidebarItem", to); // Changed to sessionStorage
      }}
      icon={<Box sx={{ display: "flex", alignItems: "center", background: "none" }}>{icon}</Box>}
    >
      <Typography sx={{ fontWeight: "bold" }}>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({ isSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);

  useEffect(() => {
    // Sync the selected state with the current route path
    setSelected(location.pathname);
    sessionStorage.setItem("selectedSidebarItem", location.pathname);
  }, [location.pathname]); // Trigger effect when route changes

  const logoSrc = theme.palette.mode === "dark" ? logoDark : logoLight;

  return (
    <Box
      sx={{
        position: isMobile ? "absolute" : "fixed",
        left: 0,
        top: 0,
        width: "270px",
        height: "100vh",
        background: colors.primary[400],
        display: "flex",
        flexDirection: "column",
        zIndex: isMobile ? 1300 : 1,
        "& .pro-sidebar-inner": { background: `${colors.primary[400]} !important` },
        "& .pro-icon-wrapper": { backgroundColor: "transparent !important" },
        "& .pro-inner-item": { padding: "5px 35px 5px 20px !important" },
        "& .pro-inner-item:hover": { color: "#868dfb !important" },
        "& .pro-menu-item.active": { color: "#fff !important" },
      }}
    >
      <Box alignItems="center" sx={{ width: "100%", padding: "20px" }}>
        <img src={logoSrc} alt="logo" style={{ width: "100%", cursor: "pointer" }} />
      </Box>

      <ProSidebar>
        <Menu iconShape="square" style={{ padding: "20px", borderRadius: "20px" }}>
          <Item title="Dashboard" to="/" icon={<HomeOutlinedIcon />} selected={selected} setSelected={setSelected} />
          <Item title="Experience" to="/Experience" icon={<WorkOutlineOutlinedIcon />} selected={selected} setSelected={setSelected} />
          {/* <Item title={ <div style={{ fontWeight: "bold", textAlign: "flex-start" }}> Customer Relationship <br /> Manager</div>} to="/crm" icon={<HandshakeOutlinedIcon />} selected={selected} setSelected={setSelected} />
          <Item title="Head of the Business" to="/hob" icon={<BusinessOutlinedIcon />} selected={selected} setSelected={setSelected} />
          <Item title="Calendar" to="/calendar" icon={<CalendarTodayOutlinedIcon />} selected={selected} setSelected={setSelected} /> */}
          <Item title="Logout" icon={<LogoutOutlinedIcon />} selected={selected} setSelected={setSelected} />
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
