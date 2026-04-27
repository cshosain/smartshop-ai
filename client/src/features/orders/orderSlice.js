import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderAPI from './orderAPI';

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await orderAPI.placeOrder(orderData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Order failed');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await orderAPI.getMyOrders();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await orderAPI.getOrderById(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchAdminStats = createAsyncThunk(
  'orders/adminStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await orderAPI.getAdminStats();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders:        [],
    currentOrder:  null,
    adminStats:    null,
    loading:       false,
    error:         null,
    success:       false,
  },
  reducers: {
    clearOrderSuccess: (state) => { state.success = false; },
    clearOrderError:   (state) => { state.error   = null;  },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading      = false;
        state.success      = true;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchMyOrders.pending,   (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders  = action.payload;
      })
      .addCase(fetchMyOrders.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })

      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.adminStats = action.payload;
      });
  },
});

export const { clearOrderSuccess, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;