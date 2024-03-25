import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Drawer from '@mui/material/Drawer';

import { Endpoint } from '../../routes/endpoint';
import { Link } from 'react-router-dom';
import { InsertComment, AssignmentInd, Home, Analytics, AutoStories } from '@mui/icons-material/';
import HyandLogo from '../../assets/images/hyand-logo.gif';

export default function NavigationBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedNavItem, setSelectedNavItem] = React.useState<string>('Home');

  const navItems = [
    { to: Endpoint.MAIN_PAGE, icon: <Home sx={{ color: 'black' }} />, text: 'Home' },
    { to: Endpoint.STATISTICS, icon: <Analytics sx={{ color: 'black' }} />, text: 'Statistics' },
    { to: Endpoint.CAREER, icon: <AssignmentInd sx={{ color: 'black' }} />, text: 'Career' },
    { to: Endpoint.FEEDBACK, icon: <InsertComment sx={{ color: 'black' }} />, text: 'Feedback' },
    { to: Endpoint.WIKI, icon: <AutoStories sx={{ color: 'black' }} />, text: 'Wiki' },
  ];

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleNavItemClick = (navItem: string) => {
    setSelectedNavItem(navItem);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
              <MenuItem onClick={handleCloseMenu}>My account</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        variant="permanent"
        PaperProps={{
          sx: {
            display: 'flex',
            alignItems: 'center',
            width: '150px',
            backgroundColor: '#FAFBFD',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 1,
            marginBottom: 4,
            marginTop: 4,
          }}
        >
          <img src={HyandLogo} alt="Hyand Logo" />
          <Typography variant="h4" fontWeight={'bold'} color="secondary" textAlign={'center'}>
            Skills Matrix
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          {navItems.map((item) => (
            <Box
              key={item.text}
              component={Link}
              to={item.to}
              onClick={() => handleNavItemClick(item.text)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100px',
                height: '100px',
                borderRadius: '10px',
                transition: 'background-color 0.2s',
                ':hover': {
                  backgroundColor: '#ebebeb',
                },
                backgroundColor: item.text === selectedNavItem ? '#ebebeb' : 'transparent',
                color: item.text === selectedNavItem ? 'black' : 'gray',
              }}
            >
              {React.cloneElement(item.icon, { sx: { color: item.text === selectedNavItem ? 'black' : 'gray' } })}
              <Typography
                variant="h6"
                sx={{ color: 'inherit', fontWeight: item.text === selectedNavItem ? 'bold' : 'normal' }}
              >
                {item.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Drawer>
    </Box>
  );
}
