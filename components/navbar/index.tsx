// components/MobileNav.tsx
"use client";

import React, { useState } from 'react';
import { 
  BottomNavigation, 
  BottomNavigationAction,
  Box,
  Fab,
  Menu,
  MenuItem,
  Paper,
  styled,
  useTheme
} from '@mui/material';
import {
  ListAlt,  
  BroadcastOnHome,  
  CloudQueue,
  Map,
  PriorityHigh,
  LocalGasStation,
  CameraOutdoor,
  Book,
  Article,
  Info,
  Air,
  Lightbulb,
  AccountBox,
  EnhancedEncryption,
  Menu as MenuIcon,
  Add
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import resources from '@/resources';

const StyledFab = styled(Fab)({
  position: 'absolute',
  top: -30,
  left: '50%',
  transform: 'translateX(-50%)',
  boxShadow: 'none',
  '&:active': {
    boxShadow: 'none',
  },
});

export default function MobileNav() {
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const pathname = usePathname();

  // Define main navigation items (customize this array to select which items appear in the bottom bar)
  const mainNavItems = ['home', 'atis', 'fuel', 'profiles'];
  const mainNavResources = resources.filter(resource => mainNavItems.includes(resource.name));
  const menuResources = resources.filter(resource => !mainNavItems.includes(resource.name));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        display: { xs: 'block'},
        backdropFilter: 'blur(10px)',
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(18, 18, 18, 0.8)' 
          : 'rgba(255, 255, 255, 0.8)',
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        sx={{
          height: "10vh",
          backgroundColor: 'transparent',
        }}
      >
        {mainNavResources.map((resource) => (
          <BottomNavigationAction
            key={resource.name}
            label={resource.meta.label}
            icon={resource.meta.icon}
            component={Link}
            href={resource.list}
            sx={{
              minWidth: 'auto',
              color: pathname === resource.list 
                ? theme.palette.primary.main 
                : theme.palette.text.secondary,
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                transition: 'color 0.2s',
                fontWeight: pathname === resource.list ? 600 : 400,
              },
            }}
          />
        ))}

        {/* Floating Menu Button */}
        <Box sx={{ position: 'relative', width: 40 }}>
          <StyledFab
            color="primary"
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{
              backgroundColor: theme.palette.mode === 'dark' 
                ? theme.palette.primary.dark 
                : theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            <MenuIcon />
          </StyledFab>
        </Box>
      </BottomNavigation>

      {/* Floating Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            mt: -8,
            borderRadius: 4,
            boxShadow: theme.shadows[6],
            minWidth: 200,
          }
        }}
      >
        {menuResources.map((resource) => (
          <MenuItem 
            key={resource.name}
            onClick={handleMenuClose}
            component={Link}
            href={resource.list}
          >
            {resource.meta.icon}
            <Box sx={{ ml: 2 }}>{resource.meta.label}</Box>
          </MenuItem>
        ))}
        {/* Add Create Actions */}
        {resources.filter(r => r.create).map((resource) => (
          <MenuItem
            key={`create-${resource.name}`}
            onClick={handleMenuClose}
            component={Link}
            href={resource.create}
          >
            <Add sx={{ mr: 2 }} />
            Create {resource.meta.label}
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
}