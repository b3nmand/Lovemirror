<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Auth } from './pages/Auth';
<<<<<<< HEAD
import { ProfileSetup } from './pages/ProfileSetup';
=======
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
import { SelfImprovement } from './pages/SelfImprovement';
import { WifeMaterialAssessment } from './pages/WifeMaterialAssessment';
import { BridalPriceAssessment } from './pages/BridalPriceAssessment';
import { HighValueAssessment } from './pages/HighValueAssessment';
import { Dashboard } from './pages/Dashboard';
import { Education } from './pages/Education';
import { Goals } from './pages/Goals';
<<<<<<< HEAD
=======
import { ProfileSetup } from './pages/ProfileSetup';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
import { Settings } from './pages/Settings';
import { Assessment } from './pages/Assessment';
import { HighValueResults } from './pages/HighValueResults';
import { WifeMaterialResults } from './pages/WifeMaterialResults';
import { AssessorManagement } from './pages/AssessorManagement';
import { BridalPriceResults } from './pages/BridalPriceResults';
import { DelusionalScore } from './pages/DelusionalScore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CompatibilityScore } from './components/CompatibilityScore';
<<<<<<< HEAD
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
=======
import { PartnerAssessment } from './pages/PartnerAssessment';
import { ExternalAssessment } from './pages/ExternalAssessment';
import { AssessmentComplete } from './pages/assessment-complete';
import { Sidebar } from './components/Sidebar';
import { Welcome } from './pages/Welcome';
import ErrorBoundary from './components/ErrorBoundary';
import { supabase } from './lib/supabase';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  console.log('App component rendering');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    console.log('App useEffect - checking user');
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      try {
        console.log('Auth state changed in App:', session ? 'user logged in' : 'no user');
        setUser(session?.user ?? null);
        setInitializing(false);
        
        // Force a subscription check after authentication
        if (session?.user) {
          console.log('User authenticated, checking subscription');
          checkSubscription();
        }
      } catch (error) {
        console.error('Error in auth state change listener:', error);
      }
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    });

    return () => subscription.unsubscribe();
  }, []);

<<<<<<< HEAD
  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
=======
  const checkSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Checking subscription for user:', user?.id);
      if (!user) return;
      
      // Check if there's a pending assessment ID in localStorage
      const pendingAssessmentId = localStorage.getItem('pendingAssessmentId');
      if (pendingAssessmentId && pendingAssessmentId !== 'null' && pendingAssessmentId !== 'undefined') {
        console.log('Found pending assessment ID after auth change:', pendingAssessmentId);
        
        // Check subscription status
        const hasSubscription = await checkSubscriptionByCustomerId(user.id);
        console.log('Subscription check after auth change:', hasSubscription);
        console.log('Pending assessment ID:', pendingAssessmentId);
        
        if (hasSubscription) {
          // Get assessment type
          const { data: assessment } = await supabase
            .from('assessment_history')
            .select('assessment_type')
            .eq('id', pendingAssessmentId)
            .single();
          console.log('Assessment type:', assessment?.assessment_type);
            
          if (assessment) {
            // Redirect to appropriate results page
            const redirectPath = assessment.assessment_type === 'bridal-price' 
              ? `/assessment-results/${pendingAssessmentId}`
              : assessment.assessment_type === 'wife-material'
              ? `/wife-material-results/${pendingAssessmentId}`
              : `/high-value-results/${pendingAssessmentId}`;
              
            console.log('Redirecting to results after auth change:', redirectPath);
            navigate(redirectPath);
            
            // Clear pending assessment ID
            localStorage.removeItem('pendingAssessmentId');
          }
        }
      }
    } catch (error) {
      console.error('Error checking subscription in App:', error);
    }
  };

  const checkUser = async () => {
    try {
      console.log('Checking auth state...');
      const { data: { user } } = await supabase.auth.getUser();
      console.log('User check result:', user ? 'authenticated' : 'not authenticated');
      console.log('User details:', user);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      setUser(user);
    } catch (error) {
      console.error('Error checking auth state:', error);
    }
  }

  return (
<<<<<<< HEAD
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
=======
    <ErrorBoundary fallback={
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="mb-4 text-gray-600">The application encountered an error. Please try refreshing the page.</p>
          <button onClick={() => window.location.reload()} className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors">
            Refresh Page
          </button>
        </div>
      </div>
    }>
    <ErrorBoundary>
      <Router className="min-h-screen flex flex-col">
        <AuthProvider>
          <SubscriptionProvider>
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
                <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
                <Route path="/partner-assessment/:invitationCode" element={<PartnerAssessment />} />
                <Route path="/external-assessment/:invitationCode" element={<ExternalAssessment />} />
                <Route path="/assessment-complete" element={<AssessmentComplete />} />
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
                    <ProtectedRoute assessmentId={location.pathname.split('/').pop()}>
                      <BridalPriceResults />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wife-material-results/:assessmentId"
                  element={
                    <ProtectedRoute assessmentId={location.pathname.split('/').pop()}>
                      <WifeMaterialResults />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/high-value-results/:assessmentId"
                  element={
                    <ProtectedRoute assessmentId={location.pathname.split('/').pop()}>
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
                {/* Catch-all route for 404 handling */}
                <Route path="*" element={
                  <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50">
                    <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 text-center">
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                      <p className="text-gray-600 mb-6">The page you're looking for doesn't exist or has been moved.</p>
                      <Button 
                        onClick={() => window.location.href = user ? '/dashboard' : '/'}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                      >
                        Return to {user ? 'Dashboard' : 'Home'}
                      </Button>
                    </div>
                  </div>
                } />
              </Routes>
              </div>
            </div>
          </SubscriptionProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
    </ErrorBoundary>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
  );
}

export default App;