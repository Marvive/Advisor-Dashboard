'use client';
import { Container, CssBaseline, Box, AppBar, Toolbar, Typography } from '@mui/material';

export default function Layout({ children }) {
  return (
    <>
      <CssBaseline />
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Compound Planning
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