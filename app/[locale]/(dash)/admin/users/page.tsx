'use client';

import { 
  Box, Typography, Paper, Grid, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, 
  Chip, TextField, InputAdornment, Stack, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  MenuItem, Select, FormControl, InputLabel 
} from '@mui/material';
import { 
  Search, FilterList, Add
} from '@mui/icons-material';
import { useTable, useDelete, useNotification } from '@refinedev/core';
import { EditButton, DeleteButton } from '@refinedev/mui';
import { useForm } from '@refinedev/react-hook-form';
import { Controller } from 'react-hook-form';
import { useState } from 'react';
import { ProfileAvatar } from '@components/functions/FetchFunctions';
import { ProfileData } from '@/types/index';

const statusColors: Record<ProfileData['status'], 'success' | 'warning' | 'error'> = {
  active: 'success',
  pending: 'warning',
  suspended: 'error'
};

const roleColors: Record<ProfileData['role'], 'primary' | 'info' | 'secondary'> = {
  admin: 'primary',
  pilot: 'info',
  staff: 'secondary'
};

export default function MembersList() {
  const { open } = useNotification();
  const [openDialog, setOpenDialog] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    tableQueryResult,
  } = useTable<ProfileData>({
    resource: 'profiles',
    filters: {
      permanent: [
        ...(filter === 'all'
          ? []
          : [{
              field: 'status',
              operator: 'eq' as const,
              value: filter
            }]
        )
      ]
    }
  });

  const handleDelete = async (id: string) => {
    try {
      console.log('Attempting to delete user:', id) // Debug log
      
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })
      
      const result = await response.json()
      console.log('API response:', result) // Debug log

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete user')
      }

      // Force immediate refresh of the table
      await tableQueryResult.refetch()
      
      open?.({
        type: 'success',
        message: 'User and profile deleted successfully',
        description: `User ID: ${id}`,
      })

    } catch (error: any) {
      console.error('Delete error:', error) // Debug log
      open?.({
        type: 'error',
        message: 'Deletion failed',
        description: error.message,
      })
    }
  }

 // In your MembersList component
  const { 
    refineCore: { onFinish: refineOnFinish, formLoading }, 
    register, 
    handleSubmit,
    control,
    reset 
  } = useForm({
    refineCoreProps: {
      resource: 'profiles',
      action: 'create',
      onMutationSuccess: () => {
        reset();
        setOpenDialog(false);
        open?.({
          type: 'success',
          message: 'Member created successfully',
        });
      }
    }
  });

  const onFinish = async (data: any) => {
    try {
      const response = await fetch('/api/users/create-users', {  // Updated endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          user_metadata: {
            fullname: data.fullname,
            licence: data.licence,
            status: data.status,
            role: data.role
          }
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create user');
      }

      tableQueryResult.refetch();
      open?.({
        type: 'success',
        message: 'User created successfully',
      });
      
      setOpenDialog(false);
      reset();
    } catch (error: any) {
      open?.({
        type: 'error',
        message: error.message || 'Error creating user',
      });
    }
  };

  const members = tableQueryResult?.data?.data || [];

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" sx={{ flexDirection: { xs: "column", sm: "row" } }} justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Member Management
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              background: 'linear-gradient(135deg, #2196f3, #1976d2)'
            }}
          >
            Add Member
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  label="Status"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Members</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
              <Button 
                variant="outlined" 
                startIcon={<FilterList />}
                sx={{ borderRadius: 2 }}
              >
                Filters
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell>Member</TableCell>
              <TableCell>License</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined at</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <ProfileAvatar profileId={member.id} />
                    <Box>
                      <Typography fontWeight="medium">{member.fullname}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{member.licence || 'N/A'}</Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={member.status} 
                    color={statusColors[member.status]} 
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={member.role} 
                    color={roleColors[member.role]} 
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(member.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZoneName: 'short'
                        })}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <EditButton 
                      hideText 
                      resource="users" 
                      recordItemId={member.id} 
                      size="small"
                      sx={{ minWidth: 32 }}
                    />
                    <DeleteButton 
                      hideText 
                      resource="users" 
                      recordItemId={member.id} 
                      size="small"
                      sx={{ minWidth: 32 }}
                      onClick={() => handleDelete(member.id)}
                    />                  
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Member Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Member</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(onFinish)} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  {...register('fullname', { required: true })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...register('email', { required: true })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  {...register('password', { required: true })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="License Number"
                  {...register('licence')}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Controller
                    control={control}
                    name="status"
                    defaultValue="active"
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Status"
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="suspended">Suspended</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Controller
                    control={control}
                    name="role"
                    defaultValue="pilot"
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Role"
                      >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="pilot">Pilot</MenuItem>
                        <MenuItem value="staff">Staff</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit(onFinish)} 
            variant="contained"
            disabled={formLoading}
          >
            {formLoading ? 'Creating...' : 'Create Member'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}