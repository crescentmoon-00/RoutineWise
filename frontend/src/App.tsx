import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <AppProvider>
        <div className="min-h-screen bg-surface text-on-surface">
          {/* Main content will be rendered by routes */}
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-black text-primary mb-4">RoutineWise</h1>
              <p className="text-lg text-on-surface-variant mb-8">
                Your daily routine architect for neurodivergent children
              </p>
              <div className="space-y-2">
                <p className="text-sm text-on-surface-variant">
                  ✅ Project initialized successfully
                </p>
                <p className="text-sm text-on-surface-variant">
                  ✅ Design system configured
                </p>
                <p className="text-sm text-on-surface-variant">
                  ✅ State management ready
                </p>
                <p className="text-sm text-on-surface-variant">
                  ✅ Testing infrastructure set up
                </p>
              </div>
            </div>
          </div>
        </div>
      </AppProvider>
    </Router>
  );
}

export default App;
