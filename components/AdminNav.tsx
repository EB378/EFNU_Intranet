'use client';

import { usePathname } from 'next/navigation';
import { AppBar, Toolbar, Button, styled } from '@mui/material';

const GradientAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, #1976d2)`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[2],
  borderRadius: '0 0 16px 16px',
}));

const NavButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '8px 20px',
  transition: 'all 0.2s ease',
  fontWeight: 600,
  '&.MuiButton-contained': {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, #1976d2)`,
    color: '#fff',
    boxShadow: theme.shadows[3],
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: theme.shadows[6],
    }
  },
  '&.MuiButton-text': {
    color: theme.palette.text.secondary,
    '&:hover': {
      background: theme.palette.action.hover,
      transform: 'translateY(-1px)',
    }
  },
}));

export default function AdminNav() {
  const pathname = usePathname();
  
  return (
    <GradientAppBar position="sticky" sx={{ zIndex: 1201 }}>
      <Toolbar sx={{ minHeight: '64px!important' }}>
        <div className="flex items-center gap-2">
          <NavButton
            href="/admin"
            variant={pathname === '/admin' ? 'contained' : 'text'}
          >
            Overview
          </NavButton>
          <NavButton
            href="/admin/users"
            variant={pathname.startsWith('/admin/users') ? 'contained' : 'text'}
          >
            Users
          </NavButton>
          <NavButton
            href="/admin/audit"
            variant={pathname.startsWith('/admin/audit') ? 'contained' : 'text'}
          >
            Audit Logs
          </NavButton>
        </div>
      </Toolbar>
    </GradientAppBar>
  );
}