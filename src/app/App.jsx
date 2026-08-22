import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './providers/AuthProvider';
import ThemeProvider from './providers/ThemeProvider';
import ToastProvider from '@/components/ui/Toast';
import ErrorBoundary from '@/components/feedback/ErrorBoundary';
import AppRoutes from './routes';

export const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
