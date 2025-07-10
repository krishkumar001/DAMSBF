import React, { useEffect, useRef } from 'react';
import { Box, Typography, IconButton, List, ListItem, ListItemText, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const sidebarWidth = 280;

const SubmenuSidebar = ({ open, onClose, title, subPages }) => {
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  const handleSubpageClick = (sub) => {
    // Convert subpage name to route path (e.g., 'BLT' -> '/blt', 'Caster 1' -> '/caster-1')
    const path = '/' + sub.toLowerCase().replace(/\s+/g, '-');
    navigate(path);
    onClose();
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: sidebarWidth,
        bgcolor: 'background.paper',
        boxShadow: 6,
        zIndex: 1300,
        transform: open ? 'translateX(0)' : `translateX(-${sidebarWidth}px)`,
        transition: 'transform 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
      ref={sidebarRef}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>{title}</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {subPages && subPages.length > 0 ? (
          subPages.map((sub, idx) => (
            <ListItem button key={sub} onClick={() => handleSubpageClick(sub)}>
              <ListItemText primary={sub} />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No subpages available" />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default SubmenuSidebar; 