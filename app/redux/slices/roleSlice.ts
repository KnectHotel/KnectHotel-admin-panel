import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllRoles,
  Role
} from '@/lib/superAdmin/api/rolesAndPermissions/getAllRoles';

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async () => {
  const response = await getAllRoles();
  return response.roles;
});

export const rolesSlice = createSlice({
  name: 'roles',
  initialState: {
    roles: [] as Role[],
    loading: false,
    error: null as string | null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch roles';
      });
  }
});

export default rolesSlice.reducer;
