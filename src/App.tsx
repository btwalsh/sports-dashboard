import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const NHLPage = lazy(() => import('./pages/NHLPage'));
const NFLPage = lazy(() => import('./pages/NFLPage'));
const MLBPage = lazy(() => import('./pages/MLBPage'));
const F1Page = lazy(() => import('./pages/F1Page'));
const CollegePage = lazy(() => import('./pages/CollegePage'));
const TeamDetail = lazy(() => import('./pages/TeamDetail'));

function LoadingFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-surface-overlay rounded" />
        <div className="h-4 w-32 bg-surface-overlay rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-surface-overlay rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/nhl" element={<NHLPage />} />
          <Route path="/nfl" element={<NFLPage />} />
          <Route path="/mlb" element={<MLBPage />} />
          <Route path="/f1" element={<F1Page />} />
          <Route path="/college" element={<CollegePage />} />
          <Route
            path="/team/:sport/:league/:teamId"
            element={<TeamDetail />}
          />
        </Routes>
      </Suspense>
    </div>
  );
}
