import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { BarChart3, Target, BookOpen, Settings as SettingsIcon, Users, Award, Crown, Diamond, Scale, LogIn } from 'lucide-react';
=======
import { BarChart3, Target, BookOpen, Settings as SettingsIcon, Users, Award, Crown, Diamond, Scale, LogIn, LogOut, Mail, Heart } from 'lucide-react';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
import { AssessmentScores } from './AssessmentScores';
import { Menu, X, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getAssessmentType } from '../lib/assessmentType';
import type { Profile } from '../types/profile';
import { Ad } from './Ad';
<<<<<<< HEAD
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent } from './ui/card';
=======
import { ConnectionStatus } from './ui/connection-status';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent } from './ui/card';
import { BookAd } from './BookAd';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isMobile = false, isOpen = false, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([]);
<<<<<<< HEAD
=======
  const [emailVerified, setEmailVerified] = useState(true);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

  useEffect(() => {
    checkUser();
    fetchUserProfile();
    fetchAssessmentHistory();
  }, []);

  const fetchAssessmentHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessment_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (assessmentError) {
        console.error('Error fetching assessment history:', assessmentError);
      } else {
        setAssessmentHistory(assessmentData || []);
      }
    } catch (error) {
      console.error('Error fetching assessment history:', error);
    }
  };

  const getLatestAssessmentId = (type: string) => {
    const assessment = assessmentHistory.find(a => a.assessment_type === type);
    return assessment?.id;
  };

  const hasCompletedAssessment = (type: string) => {
    return assessmentHistory.some(a => a.assessment_type === type);
  };

  const checkUser = async () => {
    try {
<<<<<<< HEAD
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
=======
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        setEmailVerified(!!currentUser.email_confirmed_at);
      }
      setUser(currentUser);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

<<<<<<< HEAD
=======
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  if (!user) {
    return (
      <div className="hidden lg:flex flex-col items-center justify-center h-screen bg-white/80 backdrop-blur-sm w-64 fixed left-0 top-0">
        <LogIn className="w-12 h-12 mb-4" />
        <h2 className="text-xl font-semibold mb-4">Welcome Back</h2>
        <Button
          onClick={() => navigate('/auth')}
          variant="gradient"
        >
          Sign In
        </Button>
      </div>
    );
  }

  const sidebarClasses = `
    ${isMobile ? 'fixed inset-y-0 left-0 z-40 w-full sm:w-80 transform transition-transform duration-300 ease-in-out'
                : 'hidden lg:block fixed top-0 left-0 h-full w-64'}
    ${isMobile && !isOpen ? '-translate-x-full motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out' : 'translate-x-0 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-in'}
    bg-white/80 backdrop-blur-sm shadow-lg
  `;

  const overlayClasses = `
    fixed inset-0 bg-black/50 z-30 transition-all duration-300 ease-in-out
    ${isMobile && isOpen ? 'opacity-100 backdrop-blur-[2px]' : 'opacity-0 pointer-events-none backdrop-blur-none'}
  `;

  return (
    <>
      {isMobile && <div className={overlayClasses} onClick={onClose} />}
      <Card className={`${sidebarClasses} motion-reduce:transform-none motion-reduce:transition-none`}>
        <ScrollArea className="h-full">
          <div className="h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">
                Love Mirror
              </h2>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </Button>
              )}
            </div>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Button
                    variant={isActive('/dashboard') ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/dashboard')}
                  >
                    <BarChart3 className="w-5 h-5 mr-3" />
                    <span className="font-medium">Dashboard</span>
                  </Button>
                </li>

                {/* Assessment Links */}
                {profile && <li className="pt-2">
                  <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {profile.gender === 'male' ? 'High-Value Assessment' : 'Relationship Assessment'}
                  </div>
                  <div className="mt-2 space-y-1">
                    {profile.gender === 'male' && (
                      <button
                        onClick={() => handleNavigation('/assessment?type=high-value-man')}
                        className={`flex items-center px-4 py-2 rounded-lg transition-all w-full text-left ${
                          location.search.includes('type=high-value-man')
                            ? 'bg-blue-50 text-blue-700'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <Scale className="w-4 h-4 mr-3" />
                        <span className="font-medium">High-Value Man</span>
                      </button>
                    )}
                    
                    {profile.gender === 'female' && (
                      <>
                        <button
                          onClick={() => handleNavigation('/assessment?type=bridal-price')}
                          className={`flex items-center px-4 py-2 rounded-lg transition-all w-full text-left ${
                            location.search.includes('type=bridal-price')
                              ? 'bg-pink-50 text-pink-700'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <Crown className="w-4 h-4 mr-3" />
                          <span className="font-medium">Bridal Price Estimator</span>
                        </button>

                        <button
                          onClick={() => handleNavigation('/assessment?type=wife-material')}
                          className={`flex items-center px-4 py-2 rounded-lg transition-all w-full text-left ${
                            location.search.includes('type=wife-material')
                              ? 'bg-violet-50 text-violet-700'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <Diamond className="w-4 h-4 mr-3" />
                          <span className="font-medium">Wife Material</span>
                        </button>
                      </>
                    )}
                  </div>
                </li>}

                {/* Assessment Results */}
                {profile && assessmentHistory.length > 0 && (
                  <li className="pt-2">
                    <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {profile.gender === 'male' ? 'High-Value Results' : 'Assessment Results'}
                    </div>
                    <div className="mt-2 space-y-1">
                      {profile.gender === 'male' && hasCompletedAssessment('high-value') && (
                        <button
                          onClick={() => handleNavigation(`/high-value-results/${getLatestAssessmentId('high-value')}`)}
                          className={`flex items-center px-4 py-2 rounded-lg transition-all w-full text-left ${
                            location.pathname.includes('/high-value-results')
                              ? 'bg-blue-50 text-blue-700'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <TrendingUp className="w-4 h-4 mr-3" />
                          <span className="font-medium">High-Value Results</span>
                        </button>
                      )}
                      
                      {profile.gender === 'female' && (
                        <>
                          {hasCompletedAssessment('bridal-price') && (
                            <button
                              onClick={() => handleNavigation(`/assessment-results/${getLatestAssessmentId('bridal-price')}`)}
                              className={`flex items-center px-4 py-2 rounded-lg transition-all w-full text-left ${
                                location.pathname.includes('/assessment-results')
                                  ? 'bg-pink-50 text-pink-700'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <Crown className="w-4 h-4 mr-3" />
                              <span className="font-medium">Bridal Price Results</span>
                            </button>
                          )}
                          
                          {hasCompletedAssessment('wife-material') && (
                            <button
                              onClick={() => handleNavigation(`/wife-material-results/${getLatestAssessmentId('wife-material')}`)}
                              className={`flex items-center px-4 py-2 rounded-lg transition-all w-full text-left ${
                                location.pathname.includes('/wife-material-results')
                                  ? 'bg-violet-50 text-violet-700'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <Diamond className="w-4 h-4 mr-3" />
                              <span className="font-medium">Wife Material Results</span>
                            </button>
                          )}
                        </>
                      )}
<<<<<<< HEAD
=======

                      {/* Compatibility Score Link */}
                      <button
                        onClick={() => handleNavigation('/compatibility')}
                        className={`flex items-center px-4 py-2 rounded-lg transition-all w-full text-left ${
                          location.pathname.includes('/compatibility')
                            ? 'bg-pink-50 text-pink-700'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <Heart className="w-4 h-4 mr-3" />
                        <span className="font-medium">Compatibility Score</span>
                      </button>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                    </div>
                  </li>
                )}

                <li>
                  <button
                    onClick={() => handleNavigation('/self-improvement')}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                      isActive('/self-improvement')
                        ? 'bg-secondary-50 text-secondary-700'
                        : 'hover:bg-gray-50'
                    } w-full text-left`}
                  >
                    <Target className="w-5 h-5 mr-3" />
                    <span className="font-medium">Self-Improvement</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/education')}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                      isActive('/education')
                        ? 'bg-accent-50 text-accent-700'
                        : 'hover:bg-gray-50'
                    } w-full text-left`}
                  >
                    <BookOpen className="w-5 h-5 mr-3" />
                    <span className="font-medium">Education</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/goals')}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                      isActive('/goals')
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-gray-50'
                    } w-full text-left`}
                  >
                    <Award className="w-5 h-5 mr-3" />
                    <span className="font-medium">Goals</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/assessors')}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                      isActive('/assessors')
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-gray-50'
                    } w-full text-left`}
                  >
                    <Users className="w-5 h-5 mr-3" />
                    <span className="font-medium">External Assessors</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/settings')}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                      isActive('/settings')
                        ? 'bg-gray-100 text-gray-700'
                        : 'hover:bg-gray-50'
                    } w-full text-left`}
                  >
                    <SettingsIcon className="w-5 h-5 mr-3" />
                    <span className="font-medium">Settings</span>
                  </button>
                </li>
<<<<<<< HEAD
                <li className="mt-4">
                  <Ad slot="sidebar" />
                  <div className="mt-4">
                    <Ad slot="cog-effect" />
                  </div>
                </li>
              </ul>
            </nav>
=======
                {!emailVerified && (
                  <li>
                    <button
                      onClick={() => handleNavigation('/settings')}
                      className="flex items-center px-4 py-3 rounded-lg transition-all bg-amber-50 text-amber-700 w-full text-left"
                    >
                      <Mail className="w-5 h-5 mr-3" />
                      <span className="font-medium">Verify Email</span>
                    </button>
                  </li>
                )}
                <li className="mt-2">
                  <button
                    onClick={handleSignOut}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all hover:bg-red-50 hover:text-red-700 w-full text-left`}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </li>
              </ul>
            </nav>
            {/* Book Ad Integration */}
            <BookAd />
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
            
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Assessment Scores</h2>
              <AssessmentScores />
<<<<<<< HEAD
=======
              <div className="mt-4 flex justify-end">
                <ConnectionStatus showText={false} />
              </div>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
            </div>
          </div>
        </ScrollArea>
      </Card>
    </>
  );
}