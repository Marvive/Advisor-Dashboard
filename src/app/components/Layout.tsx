'use client';
import React, { useContext, createContext } from 'react';
import { Container, CssBaseline, Box, AppBar, Toolbar, Typography } from '@mui/material';

// Create a context for the navigation state
interface NavContextType {
  resetToAdvisorView: () => void;
  setResetFunction: (fn: () => void) => void;
}

const NavContext = createContext<NavContextType>({
  resetToAdvisorView: () => {},
  setResetFunction: () => {},
});

// Custom hook to use the navigation context
export const useNavigation = () => useContext(NavContext);

// Provider component that will wrap the app
export function NavigationProvider({ children }: { children: React.ReactNode }) {
  // Function to reset to advisor view - will be set by AdvisorTable
  const [resetFn, setResetFn] = React.useState<() => void>(() => () => {});
  
  const setResetFunction = (fn: () => void) => {
    setResetFn(() => fn);
  };
  
  const resetToAdvisorView = () => {
    resetFn();
  };
  
  return (
    <NavContext.Provider value={{ resetToAdvisorView, setResetFunction }}>
      {children}
    </NavContext.Provider>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { resetToAdvisorView } = useNavigation();

  // Function to handle click on the Wealth Dynamics title
  const handleTitleClick = () => {
    // Use the context function to reset to advisor view
    resetToAdvisorView();
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            onClick={handleTitleClick}
            sx={{ 
              flexGrow: 1, 
              color: 'white', 
              textDecoration: 'none',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.9,
              },
              '&:active': {
                opacity: 0.7,
              },
              display: 'flex',
              alignItems: 'center',
              userSelect: 'none', // Prevent text selection on click
            }}
          >
            Wealth Dynamics
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          {children}
        </Box>
      </Container>
    </>
  );
}