import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authAPI from "./authAPI";

// ── Async thunks — handle API calls and dispatch actions ──

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.register(userData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.login(credentials);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  },
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.getProfile();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.updateProfile(profileData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  },
);

// ── Initial State ──
const initialState = {
  user: null,
  loading: false,
  error: null,
};

// ── Slice ──
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous action to clear errors
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handle = (thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          if (action.payload) state.user = action.payload;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    };

    // Auth thunks that show loading/error states
    handle(registerUser);
    handle(loginUser);
    handle(updateProfile);

    // fetchProfile is silent — failure just means not logged in
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.loading = false;
        state.user = null;
        // No error set — 401 on page load is expected for guests
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.loading = false;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
