'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
export default function AdminNav() {
  const pathname = usePathname();
  
  return (
    <AppBar position="static" color="inherit">
      <Toolbar>
        <div className="flex items-center gap-4">
          <Button
            href="/admin"
            variant={pathname === '/admin' ? 'contained' : 'text'}
          >
            Overview
          </Button>
          <Button
            href="/admin/users"
            variant={pathname.startsWith('/admin/users') ? 'contained' : 'text'}
          >
            Users
          </Button>
          <Button
            href="/admin/audit"
            variant={pathname.startsWith('/admin/audit') ? 'contained' : 'text'}
          >
            Audit Logs
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}