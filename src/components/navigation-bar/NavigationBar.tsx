import * as React from 'react';

import { Drawer, Menu, MenuItem, IconButton, Typography, Toolbar, Box, AppBar } from '@mui/material';
import { Assistant, AccountCircle  } from '@mui/icons-material';

import { Endpoint } from '../../routes/endpoint';
import { Link } from 'react-router-dom';
import { InsertComment, AssignmentInd, Home, Analytics, AutoStories } from '@mui/icons-material/';
import HyandLogo from '../../assets/images/hyand-logo.gif';

import { get } from '../../api/api.ts';

export default function NavigationBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedNavItem, setSelectedNavItem] = React.useState<string>('');
  const [loggedInUser, setLoggedInUser] = React.useState<string>('');
  const [roles, setRoles] = React.useState<string[]>([]); // Track user roles

  const handleNavItemClick = (navItem: string) => {
    setSelectedNavItem(navItem);
    localStorage.setItem('selectedNavItem', navItem);
  };

  React.useEffect(() => {
    get('http://localhost:8080/api/employee/current')
      .then((response: any) => {
        setLoggedInUser(`${response.firstName} ${response.lastName}`);
        setRoles(response.roles || []); // Assuming roles are part of the response
      });

    const storedNavItem = localStorage.getItem('selectedNavItem');
    if (storedNavItem) {
      setSelectedNavItem(storedNavItem);
    }
  }, []);

  const navItems = [
    { to: Endpoint.MAIN_PAGE, icon: <Home sx={{ color: 'black' }} />, text: 'Home' },
    { to: Endpoint.STATISTICS, icon: <Analytics sx={{ color: 'black' }} />, text: 'Statistics' },
    { to: Endpoint.CAREER, icon: <AssignmentInd sx={{ color: 'black' }} />, text: 'Career' },
    { to: Endpoint.FEEDBACK, icon: <InsertComment sx={{ color: 'black' }} />, text: 'Feedback' },
    { to: Endpoint.WIKI, icon: <AutoStories sx={{ color: 'black' }} />, text: 'Wiki' },
    ...(roles.includes('ROLE_ADMIN') || roles.includes('ROLE_OWNER')
      ? [{ to: Endpoint.REVIEW_PORTAL, icon: <Assistant sx={{ color: 'black' }} />, text: 'Review Portal' }]
      : []),
  ];

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/register';
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: '#ffffff' }}>
          <div>
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
              <MenuItem component={Link} to={Endpoint.PROFILE} onClick={handleCloseMenu}>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogOut}>Log out</MenuItem>
            </Menu>
          </div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="primary"
          >
            <AccountCircle />
            <Typography fontWeight={'bold'} marginLeft={1}>
              {' '}
              {loggedInUser}
            </Typography>
          </IconButton>
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
            marginBottom: 3,
            marginTop: 3,
          }}
          component={Link}
          to={Endpoint.MAIN_PAGE}
          onClick={setSelectedNavItem.bind(null, 'Home')}
        >
          <img src={HyandLogo} alt="Hyand Logo" />
          <Typography variant="h4" fontWeight={'bold'} color="primary" textAlign={'center'}>
            Skills Matrix Framework
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
              textAlign={'center'}
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
