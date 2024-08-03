"use client"
import { useAuth, UserButton } from "@clerk/nextjs";
import React, { useState } from 'react';
import { AppBar, Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography, Button, useScrollTrigger, Slide, ListItemIcon } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Link from "next/link";

const drawerWidth = 240;

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function NavBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const { isLoaded, userId, sessionId, getToken } = useAuth();

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Ingredients Detector
      </Typography>
      <Divider />
      <List>
        {!userId && (
          <>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }} LinkComponent={'a'} href="/sign-up">
                {/* <ListItemIcon>{item.icon}</ListItemIcon> */}
                <ListItemText primary="Sign Up" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }} LinkComponent={'a'} href="/sign-in">
                {/* <ListItemIcon>{item.icon}</ListItemIcon> */}
                <ListItemText primary="Sign In" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        {userId && (
          <>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }} LinkComponent={'a'} href="/main">
                {/* <ListItemIcon>{item.icon}</ListItemIcon> */}
                <ListItemText primary="App" />
              </ListItemButton>
            </ListItem>
              <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }} LinkComponent={'a'} href="/profile">
                {/* <ListItemIcon>{item.icon}</ListItemIcon> */}
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex', mb: 10 }}>
      <HideOnScroll {...props}>
        <AppBar component="nav" sx={{ px: { xs: '5%', sm: '10%' }}}>
          <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box component='img' src='/images/logo.png' 
              sx={{ 
                display: { xs: 'none', sm: 'block' }, 
                width: '20px', 
                height: 'auto', 
                cursor: 'pointer', 
                backgroundColor: 'white',
                padding: '4px',
                }} 
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, ml: 1 }}
            >
              <Link href="/" style={{ textDecoration: 'none', color: '#fff' }}>
              Ingredients Detector
              </Link>
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                {!userId && (
                  <>
                    <Button component="a" href="/sign-up" sx={{ color: '#fff' }}>
                      Sign Up
                    </Button>
                    <Button component="a" href="/sign-in" sx={{ color: '#fff' }}>
                      Sign In
                    </Button>
                  </>
                )}
                {userId && (
                  <>
                    <Button component="a" href="/main" sx={{ color: '#fff' }}>
                      App
                    </Button>
                    <Button component="a" href="/profile" sx={{ color: '#fff' }}>
                      Profile
                    </Button>
                  </>
                )}
            </Box>
            {userId && (
              <Box sx={{ display: 'flex' }}>
                <UserButton />
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

export default NavBar;