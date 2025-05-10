// components/MobileNav.tsx
"use client";

import React, { useState } from 'react';
import { 
  BottomNavigation, 
  BottomNavigationAction,
  Box,
  Divider,
  Fab,
  Menu,
  MenuItem,
  Paper,
  styled,
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
import { CanAccess } from "@refinedev/core";
import { useLogout } from '@refinedev/core';
import { useTheme } from '@hooks/useTheme';

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'relative',
  top: '-20px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: theme.shadows[6],
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: theme.shadows[8],
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
}));

export default function MobileNav() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const pathname = usePathname();
  const { mutate: logout } = useLogout();

  // Define main navigation items
  const mainNavItems = ['home', 'atis', 'fuel', 'profiles'];
  const mainNavResources = resources.filter(resource => mainNavItems.includes(resource.name));
  const menuResources = resources.filter(resource => !mainNavItems.includes(resource.name));

  // Derive active tab from current path
  const activeTab = mainNavResources.findIndex(resource => 
    pathname.startsWith(resource.list) // Use startsWith for child routes
  );

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
        backdropFilter: 'blur(20px)',
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(18, 18, 18, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        borderTop: `1px solid ${theme.palette.divider}`,
        zIndex: 1200,
      }}
      elevation={0}
    >
      <BottomNavigation
        showLabels
        value={activeTab}
        sx={{
          height: "64px",
          backgroundColor: 'transparent',
          gap: 1,
          px: 1,
        }}
      >
        {/* Left Group */}
        {mainNavResources.slice(0, 2).map((resource) => (
          <BottomNavigationAction
            key={resource.name}
            label={resource.meta.label}
            icon={resource.meta.icon}
            component={Link}
            href={resource.list}
            sx={{
              minWidth: '72px',
              maxWidth: '96px',
              color: pathname.startsWith(resource.list) 
                ? theme.palette.primary.main 
                : theme.palette.text.secondary,
              transition: 'color 0.2s, transform 0.2s',
              '&:hover': {
                color: theme.palette.primary.dark,
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.7rem',
                mt: 0.5,
                fontWeight: pathname.startsWith(resource.list) ? 600 : 500,
              },
              '& .MuiSvgIcon-root': {
                fontSize: '1.8rem',
                mb: 0.5,
              }
            }}
          />
        ))}

        {/* Floating Menu Button */}
        <Box sx={{ 
          position: 'relative',
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <StyledFab
            color="primary"
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{
              bgcolor: theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            <MenuIcon sx={{ fontSize: '1.8rem' }} />
          </StyledFab>
        </Box>

        {/* Right Group */}
        {mainNavResources.slice(2).map((resource) => (
          <BottomNavigationAction
            key={resource.name}
            label={resource.meta.label}
            icon={resource.meta.icon}
            component={Link}
            href={resource.list}
            sx={{
              minWidth: '72px',
              maxWidth: '96px',
              color: pathname.startsWith(resource.list) 
                ? theme.palette.primary.main 
                : theme.palette.text.secondary,
              transition: 'color 0.2s, transform 0.2s',
              '&:hover': {
                color: theme.palette.primary.dark,
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.7rem',
                mt: 0.5,
                fontWeight: pathname.startsWith(resource.list) ? 600 : 500,
              },
              '& .MuiSvgIcon-root': {
                fontSize: '1.8rem',
                mb: 0.5,
              }
            }}
          />
        ))}
      </BottomNavigation>

      {/* Enhanced Floating Menu */}
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
            mt: -7,
            borderRadius: 3,
            boxShadow: theme.shadows[6],
            minWidth: 240,
            maxWidth: '80vw',
            maxHeight: "70vh",
            overflow: 'auto',
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            '& .MuiDivider-root': {
              my: 1,
            }
          }
        }}
      >
        {menuResources.map((resource) => (
          <CanAccess key={resource.name} resource={resource.name} action='list'>
            <MenuItem 
              onClick={handleMenuClose}
              component={Link}
              href={resource.list}
              sx={{
                py: 1.5,
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                }
              }}
            >
              {resource.meta.icon && React.cloneElement(resource.meta.icon, {
                sx: {
                  color: theme.palette.primary.main,
                  fontSize: '1.4rem',
                  mr: 2
                }
              })}
              <Box sx={{ 
                fontSize: '0.95rem',
                fontWeight: 500,
                color: theme.palette.text.primary
              }}>
                {resource.meta.label}
              </Box>
            </MenuItem>
          </CanAccess>
        ))}

        {menuResources.length > 0 && <Divider />}

        {/* Add Create Actions */}
        {resources
          .filter(r => r.create)
          .map((resource) => (
            <CanAccess
              key={`create-${resource.name}`}
              resource={resource.name}
              action='create'
            >
              <MenuItem
                onClick={handleMenuClose}
                component={Link}
                href={resource.create!}
              >
                <Add sx={{ mr: 2 }} />
                Create {resource.meta.label}
              </MenuItem>
            </CanAccess>
          ))}

        <Divider />

        <MenuItem 
          onClick={() => {
            logout();
            handleMenuClose();
          }}
          sx={{ color: theme.palette.error.main }}
        >
          <AccountBox sx={{ mr: 2 }} />
          Log Out
        </MenuItem>
      </Menu>
    </Paper>
  );
}