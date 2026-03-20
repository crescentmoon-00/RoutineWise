import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { AppRoutes } from './routes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen bg-surface text-on-surface font-sans">
            <AppRoutes />
          </div>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
