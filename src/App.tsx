import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';

import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';

function App() {
  return (
    <AppLayout>
      <Routes>
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        
        <Route 
          path="/customers/create" 
          element={
            <div className="flex items-center justify-center h-64 text-slate-500 font-medium">
              Formulaire de création de client (À développer)
            </div>
          } 
        />
        
        <Route 
          path="*" 
          element={
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <h1 className="text-4xl font-bold text-slate-800">404</h1>
              <p className="text-slate-500">Cette page n'existe pas.</p>
            </div>
          } 
        />
      </Routes>
    </AppLayout>
  );
}

export default App;