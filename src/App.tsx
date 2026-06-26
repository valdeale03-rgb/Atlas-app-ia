import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useCouple } from './hooks/useCouple';
import { useAdventures } from './hooks/useAdventures';
import { AppContext } from './context/AppContext';
import { LoginPage } from './pages/LoginPage';
import { SetupPage } from './pages/SetupPage';
import AdventureList from './pages/AdventureList';
import AdventurePage from './pages/AdventurePage';
import { Dashboard } from './pages/Dashboard';
import './index.css';

function AppContent() {
  const { user, loading: authLoading, logout } = useAuth();
  const { couple, loading: coupleLoading, createCouple, joinCouple } = useCouple(user);
  const { adventures, addAdventure, completeAdventure } = useAdventures(couple?.id ?? null);

  if (authLoading || coupleLoading) {
    return (
      <div className="min-h-screen bg-[#1a1612] flex items-center justify-center">
        <p className="text-[#c9a84c] font-serif text-lg animate-pulse">Cargando el pasaporte...</p>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  if (!couple) {
    return <SetupPage user={user} createCouple={createCouple} joinCouple={joinCouple} />;
  }

  return (
    <AppContext.Provider value={{ user, couple, adventures, addAdventure, completeAdventure, logout }}>
      <Routes>
        <Route path="/" element={<AdventureList />} />
        <Route path="/adventure/:id" element={<AdventurePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AppContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <main className="min-h-screen bg-[#1a1612]">
        <AppContent />
      </main>
    </BrowserRouter>
  );
}
