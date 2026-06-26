import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdventureList from './pages/AdventureList';
import AdventurePage from './pages/AdventurePage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <main className="min-h-screen bg-[#1a1612]">
        <Routes>
          <Route path="/" element={<AdventureList />} />
          <Route path="/adventure/:id" element={<AdventurePage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
