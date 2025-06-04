// @/src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import QueryClient and QueryClientProvider
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import { CartProvider } from './contexts/CartContext'; // Import CartProvider
import { Toaster as SonnerToaster } from 'sonner'; // Import Sonner Toaster
import { Toaster as UIToaster } from '@/components/ui/toaster'; // Import UI Toaster
import { TooltipProvider } from '@/components/ui/tooltip'; // Import TooltipProvider

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    }
  }
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter> {/* <--- BrowserRouter now wraps everything */}
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <CartProvider>
              <UIToaster /> {/* Place UI Toaster here */}
              <SonnerToaster /> {/* Place Sonner Toaster here */}
              <App />
            </CartProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
