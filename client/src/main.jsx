import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import store from './app/store';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Provider makes Redux store available to every component */}
    <Provider store={store}>
      <BrowserRouter>
        <App />
        {/* Global toast notification system */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontSize: '14px' },
            success: { iconTheme: { primary: '#2563eb', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);