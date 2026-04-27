import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productAPI from './productAPI';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await productAPI.getProducts(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await productAPI.getProductById(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Product not found');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await productAPI.getCategories();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchSimilarProducts = createAsyncThunk(
  'products/fetchSimilar',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await productAPI.getSimilarProducts(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchRecommendations = createAsyncThunk(
  'products/fetchRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await productAPI.getRecommendations();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const submitReview = createAsyncThunk(
  'products/submitReview',
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      const { data } = await productAPI.postReview(id, reviewData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to submit review');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items:           [],
    selectedProduct: null,
    similarProducts: [],
    recommendations: [],
    categories:      [],
    page:            1,
    pages:           1,
    total:           0,
    loading:         false,
    error:           null,
  },
  reducers: {
    clearSelectedProduct: (state) => { state.selectedProduct = null; },
    clearError:           (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending,  (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled,(state, action) => {
        state.loading = false;
        state.items   = action.payload.products;
        state.page    = action.payload.page;
        state.pages   = action.payload.pages;
        state.total   = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Fetch single product
      .addCase(fetchProductById.pending,   (state) => { state.loading = true; })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading         = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })

      // Fetch similar products
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.similarProducts = action.payload;
      })

      // Fetch recommendations
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload;
      });
  },
});

export const { clearSelectedProduct, clearError } = productSlice.actions;
export default productSlice.reducer;