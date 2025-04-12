import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Auth } from './pages/Auth';
import { ProfileSetup } from './pages/ProfileSetup';
import { SelfImprovement } from './pages/SelfImprovement';
import { WifeMaterialAssessment } from './pages/WifeMaterialAssessment';
import { BridalPriceAssessment } from './pages/BridalPriceAssessment';
import { HighValueAssessment } from './pages/HighValueAssessment';
import { Dashboard } from './pages/Dashboard';
import { Education } from './pages/Education';
import { Goals } from './pages/Goals';
import { Settings } from './pages/Settings';
import { Assessment } from './pages/Assessment';
import { HighValueResults } from './pages/HighValueResults';
import { WifeMaterialResults } from './pages/WifeMaterialResults';
import { AssessorManagement } from './pages/AssessorManagement';
import { BridalPriceResults } from './pages/BridalPriceResults';
import { DelusionalScore } from './pages/DelusionalScore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CompatibilityScore } from './components/CompatibilityScore';
import { Sidebar } from './components/Sidebar';
import { supabase } from './lib/supabase';
import { Welcome } from './pages/Welcome';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking auth state:', error);
    }
  }

  return (
    <Router className="min-h-screen flex flex-col">
      <div className="min-h-screen bg-gradient-to-br from-primary-100 via-secondary-100 to-accent-100">
        {user && (
          <>
            <div 
              className={`lg:hidden fixed top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-sm shadow-sm px-4 py-3 transition-transform duration-300 ${
                user ? 'translate-y-0' : '-translate-y-full'
              }`}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </Button>
            </div>

            {/* Mobile Sidebar */}
            <Sidebar
              isMobile
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />

            {/* Desktop Sidebar */}
            <Sidebar
              isMobile={false}
              isOpen={true}
            />
          </>
        )}
        <div className={`w-full min-h-screen flex flex-col ${user ? 'lg:ml-64 pt-14 sm:pt-16 lg:pt-0' : ''}`}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-setup"
            element={
              <ProtectedRoute>
                <ProfileSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/self-improvement"
            element={
              <ProtectedRoute>
                <SelfImprovement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment"
            element={
              <ProtectedRoute>
                <Assessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessors"
            element={
              <ProtectedRoute>
                <AssessorManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment-results/:assessmentId"
            element={
              <ProtectedRoute requireSubscription assessmentId={location.pathname.split('/').pop()}>
                <BridalPriceResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wife-material-results/:assessmentId"
            element={
              <ProtectedRoute requireSubscription assessmentId={location.pathname.split('/').pop()}>
                <WifeMaterialResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/high-value-results/:assessmentId"
            element={
              <ProtectedRoute requireSubscription assessmentId={location.pathname.split('/').pop()}>
                <HighValueResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/compatibility"
            element={
              <ProtectedRoute>
                <CompatibilityScore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delusional-score"
            element={
              <ProtectedRoute>
                <DelusionalScore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/education"
            element={
              <ProtectedRoute>
                <Education />
              </ProtectedRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;