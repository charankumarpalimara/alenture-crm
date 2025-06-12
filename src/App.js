import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, Box, useMediaQuery } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { apiUrl } from "./config";

// Import Poppins font weights
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

import Login from "./scenes/login";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Cm from "./scenes/cm";
// import Crm from "./scenes/crm";
import Bar from "./scenes/bar";
// import Form from "./scenes/form";
import CmForm from "./scenes/cmform";
// import Geography from "./scenes/geography";
import Calendar from "./scenes/calendar/calendar";
import Profile from "./scenes/profile";
import AllExperiences from "./scenes/experiences/allExperiences";
import NewExperiences from "./scenes/experiences/newExperiences";
import PendingExperiences from "./scenes/experiences/pendingExperiences";
import ResolvedExperiences from "./scenes/experiences/resolvedExperiences";
import Notes from "./scenes/notes"
import TicketDetails from "./scenes/ticketdetails";
import CmDetails from "./scenes/cmdetails";
import Organization from "./scenes/organization";
import OrganizationDetails from "./scenes/organizationdetails";
import TaskDetails from "./scenes/taskdetails";

const queryClient = new QueryClient();


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('crmtoken'));

  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  const handlelogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('crmtoken');
    sessionStorage.removeItem('CrmDetails');
  }




  const appTheme = createTheme(theme, {
    typography: {
      fontFamily: [
        'Poppins',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 500 },
      h6: { fontWeight: 500 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: 'Poppins, sans-serif',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
          },
        },
      },
      MuiTypography: {
        defaultProps: {
          fontFamily: 'Poppins, sans-serif',
        },
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={appTheme}>
          <CssBaseline />
          {isAuthenticated && (
            <>
              {/* Topbar */}
              <Box sx={{ width: "100vw", top: 5, zIndex: 1000 }}>
                <Topbar setIsSidebar={setIsSidebar} onLogout={handlelogout} />
              </Box>
              {/* Sidebar */}
              {!isMobile && isSidebar && (
                <Box
                  sx={{
                    position: "fixed",
                    left: 0,
                    top: "64px",
                    height: "calc(100vh - 64px)",
                    width: "260px",
                    zIndex: 900,
                  }}
                >
                  <Sidebar isSidebar={isSidebar} onLogout={handlelogout} />
                </Box>
              )}
            </>
          )}

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              marginLeft: isMobile ? "0px" : isSidebar && isAuthenticated ? "260px" : "0px",
              marginTop: isAuthenticated ? "0px" : "60px",
              padding: "20px 20px 20px",
              overflowY: "auto",
              transition: "margin 0.3s ease-in-out",
            }}
          >
            <Routes>
              {!isAuthenticated ? (
                <Route path="*" element={<Login onLogin={handleLogin} apiUrl={apiUrl}  />} />
              ) : (
                <>
                  <Route path="/" element={<Dashboard  />} />
                  <Route path="/cm" element={<Cm  />} />
                  {/* <Route path="/crm" element={<Crm apiUrl={apiUrl}  />} /> */}
                  {/* <Route path="/form" element={<Form apiUrl={apiUrl}  />} /> */}
                  <Route path="/cmform" element={<CmForm  />} />
                  <Route path="/bar" element={<Bar  />} />
                  <Route path="/calendar" element={<Calendar />} />
                  {/* <Route path="/geography" element={<Geography apiUrl={apiUrl} />} /> */}
                  <Route path="/notes" element={<Notes  />} />
                  <Route path="/profile" element={<Profile  />} />
                  <Route path="/ticketdetails" element={<TicketDetails  />} />
                  <Route path="/organization" element={<Organization />} />
                  <Route path="/organizationdetails" element={<OrganizationDetails />} />
                  <Route path="/cmdetails" element={<CmDetails  />} />
                  <Route path="/taskdetails" element={<TaskDetails  />} />

                  {/* Experience Routes */}
                  <Route path="/allExperiences" element={<AllExperiences  />} />
                  <Route path="/newExperiences" element={<NewExperiences  />} />
                  <Route path="/pendingExperiences" element={<PendingExperiences  />} />
                  <Route path="/resolvedExperiences" element={<ResolvedExperiences  />} />
                </>
              )}
            </Routes>
          </Box>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </QueryClientProvider>
  );
}

export default App;