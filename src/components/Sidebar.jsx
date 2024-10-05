import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Home, MusicNote, Favorite, AccountCircle } from '@mui/icons-material';
import '../style/sidebar.css';

const SidebarMenu = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      className="sidebar-menu"
      sx={{
        '& .MuiDrawer-paper': {
          width: '220px',
          backgroundColor: '#1c1c1c',
          color: '#fff',
          borderRight: '1px solid #444',
        },
      }}
    >
      <List>
        <ListItem className="sidebar-profile" sx={{ textAlign: 'center', padding: '20px' }}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <AccountCircle fontSize="large" />
          </ListItemIcon>
          <ListItemText primary="User Profile" />
        </ListItem>
        <ListItem button sx={{ '&:hover': { backgroundColor: '#333' } }}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button sx={{ '&:hover': { backgroundColor: '#333' } }}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <MusicNote />
          </ListItemIcon>
          <ListItemText primary="Playlists" />
        </ListItem>
        <ListItem button sx={{ '&:hover': { backgroundColor: '#333' } }}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <Favorite />
          </ListItemIcon>
          <ListItemText primary="Favorites" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default SidebarMenu;