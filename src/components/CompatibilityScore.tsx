import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { Heart, Send, AlertCircle, CheckCircle, Clock, Crown, Diamond } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CircularProgress } from './CircularProgress';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
=======
import { Heart, Send, AlertCircle, CheckCircle, Clock, Crown, Diamond, Users, ArrowRight, Sparkles, Award, Shield, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CircularProgress } from './CircularProgress'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import confetti from 'canvas-confetti';
import { updatePlanAfterScores } from '@/lib/aiPlanGenerator';

interface Profile {
  id: string;
  name: string;
  gender: string;
  region: string;
  cultural_context: string;
}
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

interface CompatibilityScore {
  overall_score: number;
  category_scores: {
    categories: Array<{
      category_id: string;
      score1: number;
      score2: number;
      compatibility: number;
    }>;
  };
  strengths: {
    areas: string[];
  };
  improvements: {
    areas: string[];
  };
<<<<<<< HEAD
=======
  user1_id: string;
  user2_id: string;
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
}

interface Category {
  id: string;
  name: string;
  description: string;
}

<<<<<<< HEAD
export function CompatibilityScore() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
=======
// Add this type above your component
// type AssessmentOption = { key: string; label: string; };

export function CompatibilityScore() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<Profile | null>(null);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
  const [compatibilityScore, setCompatibilityScore] = useState<CompatibilityScore | null>(null);
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<'wife-material' | 'bridal-price' | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSending, setInviteSending] = useState(false);
<<<<<<< HEAD
=======
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [completedAssessments, setCompletedAssessments] = useState<string[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<string>('');
  const navigate = useNavigate();
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

  useEffect(() => {
    fetchUserProfile();
    fetchCategories();
  }, []);

<<<<<<< HEAD
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
      
      // Check for existing compatibility score
      const { data: scoreData } = await supabase
        .from('compatibility_scores')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .single();

      if (scoreData) {
        setCompatibilityScore(scoreData);
        if (scoreData.overall_score >= 80) {
          triggerConfetti();
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };
=======
  useEffect(() => {
    if (compatibilityScore) {
      fetchPartnerProfile();
      
      // Update the development plan after compatibility score calculation
      const updatePlan = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await updatePlanAfterScores(user.id);
          }
        } catch (err) {
          console.error('Error updating plan after compatibility score:', err);
        }
      };
      
      updatePlan();
    }
  }, [compatibilityScore]);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

  const fetchCategories = async () => {
    try {
      const { data: categoriesData } = await supabase
        .from('unified_assessment_categories')
        .select('*');

      if (categoriesData) {
        const categoryMap = categoriesData.reduce((acc, cat) => ({
          ...acc,
          [cat.id]: cat
        }), {});
        setCategories(categoryMap);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

<<<<<<< HEAD
=======
  const fetchPartnerProfile = async () => {
    try {
      if (!compatibilityScore) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      // Type guard for user1_id and user2_id
      if ('user1_id' in compatibilityScore && 'user2_id' in compatibilityScore) {
        const partnerId = compatibilityScore.user1_id === user.id 
          ? compatibilityScore.user2_id 
          : compatibilityScore.user1_id;
        const { data: partnerData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', partnerId)
          .single();
        setPartnerProfile(partnerData);
      }
    } catch (err) {
      console.error('Error fetching partner profile:', err);
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

      setUserProfile(profileData);
      
      // Fetch completed assessments
      const { data: assessmentHistory } = await supabase
        .from('assessment_history')
        .select('assessment_type')
        .eq('user_id', user.id);

      if (assessmentHistory) {
        setCompletedAssessments(assessmentHistory.map(a => a.assessment_type));
      }

      // Check for existing compatibility score
      const { data: scoreData, error: scoreError } = await supabase
        .from('compatibility_scores')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(1);

      if (scoreError) {
        console.error('Error fetching compatibility score:', scoreError);
      } else if (scoreData && scoreData.length > 0) {
        setCompatibilityScore(scoreData[0]);
        if (scoreData[0].overall_score >= 80) {
          triggerConfetti();
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const getCompatibilityLevel = (score: number) => {
    if (score >= 90) return { label: 'Exceptional Match', icon: <Award className="w-5 h-5 text-amber-500" /> };
    if (score >= 80) return { label: 'Strong Match', icon: <Shield className="w-5 h-5 text-emerald-500" /> };
    if (score >= 70) return { label: 'Good Match', icon: <CheckCircle className="w-5 h-5 text-blue-500" /> };
    if (score >= 60) return { label: 'Moderate Match', icon: <Sparkles className="w-5 h-5 text-violet-500" /> };
    return { label: 'Growing Match', icon: <Heart className="w-5 h-5 text-pink-500" /> };
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return 'from-amber-500 to-yellow-500';
    if (score >= 80) return 'from-emerald-500 to-green-500';
    if (score >= 70) return 'from-blue-500 to-indigo-500';
    if (score >= 60) return 'from-violet-500 to-purple-500';
    return 'from-pink-500 to-rose-500';
  };

>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
  const handleAssessmentSelect = (type: 'wife-material' | 'bridal-price') => {
    setSelectedAssessmentType(type);
    setShowAssessmentModal(false);
    setShowInviteModal(true);
  };
<<<<<<< HEAD
=======
  
  const generateInviteCode = async () => {
    try {
      setInviteSending(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      // Create a partner link
      const { data: partnerLink, error: linkError } = await supabase
        .from('partner_links')
        .insert({
          user_id: user.id
        })
        .select()
        .single();
        
      if (linkError) throw linkError;
      
      // Set the invite code
      setInviteCode(partnerLink.partner_code);
      
    } catch (err) {
      console.error('Error generating invite code:', err);
      setError('Failed to generate invite code');
    } finally {
      setInviteSending(false);
    }
  };
  
  const copyInviteLink = async () => {
    if (!inviteCode) return;
    
    try {
      const inviteUrl = `${window.location.origin}/partner-assessment/${inviteCode}`;
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      setError('Failed to copy invite link');
    }
  };

  // Gender logic and available options
  type AssessmentOption = { key: string; label: string; };
  const options: AssessmentOption[] = [
    { key: 'bridal-price', label: 'Bridal Price Estimator' },
    { key: 'wife-material', label: 'Wife Material' },
    { key: 'high-value', label: 'High Value Man' }
  ];

  const isFemale = userProfile?.gender === 'female';
  const isMale = userProfile?.gender === 'male';

  const availableOptions: AssessmentOption[] = isFemale
    ? options.filter(opt =>
        ['bridal-price', 'wife-material'].includes(opt.key) &&
        completedAssessments.includes(opt.key)
      )
    : options.filter(opt =>
        opt.key === 'high-value' && completedAssessments.includes(opt.key)
      );

  useEffect(() => {
    if (availableOptions.length > 0) {
      setSelectedAssessment(availableOptions[0].key);
    }
  }, [availableOptions.length]);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

  const handleInvitePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteSending(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

<<<<<<< HEAD
      if (!selectedAssessmentType && profile?.gender === 'female') {
        throw new Error('Please select an assessment type');
      }

      const assessmentType = profile?.gender === 'male' ? 'high-value' : selectedAssessmentType;

=======
      let assessmentType: string;
      if (isMale) {
        assessmentType = 'high-value';
      } else if (selectedAssessment) {
        assessmentType = selectedAssessment;
      } else {
        throw new Error('Please select an assessment type');
      }

      // Store the partner's email in the invitation
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      const { data: invitation, error } = await supabase
        .from('partner_invitations')
        .insert({
          sender_id: user.id,
          recipient_id: null,
<<<<<<< HEAD
          assessment_type: assessmentType
=======
          assessment_type: assessmentType,
          recipient_email: inviteEmail
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
        })
        .select()
        .single();

      if (error) throw error;

<<<<<<< HEAD
      setShowInviteModal(false);
=======
      // Generate invite code
      await generateInviteCode();
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      setInviteEmail('');
    } catch (err) {
      console.error('Error sending invitation:', err);
      setError('Failed to send invitation');
    } finally {
      setInviteSending(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
<<<<<<< HEAD
        <CircularProgress />
=======
        <CircularProgress value={100} />
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      </div>
    );
  }

  if (!compatibilityScore) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <Card className="text-center">
          <CardHeader>
            <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
            <CardTitle className="text-3xl">
              Unlock Your Compatibility Score
            </CardTitle>
            <CardDescription>
              Invite your partner to complete their assessment and discover your relationship compatibility.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowInviteModal(true)}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
<<<<<<< HEAD
              size="lg"
            >
=======
              size="lg">
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
              <Send className="w-5 h-5 mr-2" />
              Send Partner Invitation
            </Button>
          </CardContent>
        </Card>

          {/* Assessment Type Selection Modal */}
<<<<<<< HEAD
          {showAssessmentModal && profile?.gender === 'female' && (
=======
          {showAssessmentModal && userProfile?.gender === 'female' && (
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
            <Dialog open={showAssessmentModal} onOpenChange={setShowAssessmentModal}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Choose Assessment Type</DialogTitle>
                  <DialogDescription>
                    Select which assessment you'd like your partner to take
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Card 
                    className="cursor-pointer hover:border-pink-500 transition-colors"
                    onClick={() => handleAssessmentSelect('bridal-price')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <Crown className="w-6 h-6 text-pink-500 mr-3" />
                        <div>
                          <h4 className="font-semibold">Bridal Price Assessment</h4>
                          <p className="text-sm text-muted-foreground">Traditional value estimation</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card 
                    className="cursor-pointer hover:border-violet-500 transition-colors"
                    onClick={() => handleAssessmentSelect('wife-material')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <Diamond className="w-6 h-6 text-violet-500 mr-3" />
                        <div>
                          <h4 className="font-semibold">Wife Material Assessment</h4>
                          <p className="text-sm text-muted-foreground">Modern relationship readiness</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowAssessmentModal(false)}
                >
                  Cancel
                </Button>
              </DialogContent>
            </Dialog>
          )}

          {showInviteModal && (
            <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Your Partner</DialogTitle>
                  <DialogDescription>
                    Send an invitation to your partner to complete their assessment
                  </DialogDescription>
                </DialogHeader>
<<<<<<< HEAD
                <form onSubmit={handleInvitePartner}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Partner's Email
                      </label>
                      <Input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                      />
=======
                {/* Error and Success Alerts */}
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {inviteCode && (
                  <Alert variant="success" className="mb-4 fade-in">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Invite link generated! Share it with your partner.
                    </AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleInvitePartner}>
                  <div className="space-y-4 py-4">
                    {isFemale && availableOptions.length > 1 && (
                      <div>
                        <label className="block mb-1 font-medium">Select Assessment to Invite</label>
                        <select
                          value={selectedAssessment}
                          onChange={e => setSelectedAssessment(e.target.value)}
                          className="w-full border rounded px-2 py-1 transition-colors focus:border-pink-500 hover:border-pink-400"
                          required
                          aria-label="Select assessment to invite"
                        >
                          {availableOptions.map(opt => (
                            <option key={opt.key} value={opt.key}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {isFemale && availableOptions.length === 1 && (
                      <div>
                        <div className="font-medium">Assessment to Invite</div>
                        <div className="text-gray-700">{availableOptions[0].label}</div>
                      </div>
                    )}
                    {isMale && availableOptions.length === 1 && (
                      <div>
                        <div className="font-medium">Assessment to Invite</div>
                        <div className="text-gray-700">High Value Man</div>
                      </div>
                    )}
                    <div className="space-y-2">
                      {!inviteCode ? (
                        <>
                          <label className="text-sm font-medium" htmlFor="partner-email">
                            Partner's Email
                          </label>
                          <Input
                            id="partner-email"
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            required
                            aria-label="Partner's Email"
                          />
                        </>
                      ) : null}
                      {inviteCode && (
                        <div className="space-y-2 fade-in">
                          <label className="text-sm font-medium">
                            Share this link with your partner
                          </label>
                          <div className="flex gap-2 items-center">
                            <Input
                              value={`${window.location.origin}/partner-assessment/${inviteCode}`}
                              readOnly
                              className="flex-1"
                              aria-label="Invite Link"
                            />
                            <Button
                              type="button"
                              onClick={copyInviteLink}
                              variant="outline"
                              aria-label="Copy invite link"
                            >
                              {copied ? (
                                <span className="flex items-center gap-1 text-green-600"><Check className="h-4 w-4" /> Copied!</span>
                              ) : (
                                <span className="flex items-center gap-1"><Copy className="h-4 w-4" /> Copy</span>
                              )}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Your partner will complete their assessment, and then your compatibility score will be calculated.
                          </p>
                        </div>
                      )}
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowInviteModal(false);
<<<<<<< HEAD
                        setSelectedAssessmentType(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={inviteSending}
                    >
                      {inviteSending ? (
                        <>
                          <Clock className="w-4 h-4 inline-block animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        'Send Invitation'
                      )}
                    </Button>
                  </DialogFooter>
=======
                        setSelectedAssessment('');
                        setInviteCode(null);
                      }}
                      aria-label="Cancel invitation"
                    >
                      Cancel
                    </Button>
                    {!inviteCode ? (
                      <Button
                        type="submit"
                        disabled={inviteSending || availableOptions.length === 0}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-colors"
                        aria-label="Generate invite link"
                      >
                        {inviteSending ? (
                          <>
                            <Clock className="w-4 h-4 inline-block animate-spin mr-2" />
                            Generating...
                          </>
                        ) : (
                          'Generate Invite Link'
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => {
                          setShowInviteModal(false);
                          setSelectedAssessment('');
                          setInviteCode(null);
                        }}
                        aria-label="Done"
                      >
                        Done
                      </Button>
                    )}
                  </DialogFooter>
                  {availableOptions.length === 0 && (
                    <div className="text-xs text-red-500 mt-2">
                      You must complete an assessment before inviting your partner.
                    </div>
                  )}
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                </form>
              </DialogContent>
            </Dialog>
          )}
      </div>
    );
  }

<<<<<<< HEAD
=======
  // Get compatibility level based on score
  const compatibilityLevel = getCompatibilityLevel(compatibilityScore.overall_score);
  const compatibilityColor = getCompatibilityColor(compatibilityScore.overall_score);

>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-12 bg-white/80 backdrop-blur-sm border-none">
        <CardHeader className="text-center">
<<<<<<< HEAD
          <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <CardTitle className="text-3xl">
            Compatibility Score
          </CardTitle>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10">
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {compatibilityScore.overall_score.toFixed(1)}%
            </span>
          </div>
        </CardHeader>
=======
          <img src="/lovemirror_nobg_logo.png" alt="Love Mirror Logo" className="w-16 h-16 mx-auto mb-4" />
          <CardTitle className="text-3xl">
            Relationship Compatibility
          </CardTitle>
          <div className="flex flex-col items-center mt-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10">
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                {compatibilityScore.overall_score.toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-lg font-medium">
              {compatibilityLevel.icon}
              <span>{compatibilityLevel.label}</span>
            </div>
          </div>
        </CardHeader>

        {/* User profiles */}
        <CardContent className="flex flex-col items-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {userProfile?.name?.charAt(0) || 'Y'}
              </div>
              <h3 className="mt-2 font-semibold text-lg">{userProfile?.name || 'You'}</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <div className={`text-sm font-medium px-3 py-1 rounded-full mt-2 bg-gradient-to-r ${compatibilityColor} text-white`}>
                {compatibilityScore.overall_score.toFixed(1)}% Compatible
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                {partnerProfile?.name?.charAt(0) || 'P'}
              </div>
              <h3 className="mt-2 font-semibold text-lg">{partnerProfile?.name || 'Partner'}</h3>
            </div>
          </div>
        </CardContent>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Category Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-4">
            {compatibilityScore.category_scores.categories.map((category) => (
              <div key={category.category_id}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{categories[category.category_id]?.name}</span>
                  <span>{category.compatibility.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
<<<<<<< HEAD
                    className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                    style={{ width: `${category.compatibility}%` }}
                  />
                </div>
=======
                    className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${category.compatibility}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>You: {category.score1.toFixed(1)}%</span>
                  <span>Partner: {category.score2.toFixed(1)}%</span>
                </div>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
              </div>
            ))}
          </div>
          </CardContent>
        </Card>

        {/* Strengths & Improvements */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                Relationship Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
            <ul className="space-y-2">
              {compatibilityScore.strengths.areas.map((categoryId) => (
                <li key={categoryId} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2" />
                  {categories[categoryId]?.name}
<<<<<<< HEAD
                </li>
              ))}
            </ul>
=======
                  <span className="ml-auto text-sm text-emerald-600 font-medium">
                    Strong Match
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
              <p className="text-sm text-emerald-800">
                These are areas where you and your partner naturally align. Build on these strengths to support growth in other areas.
              </p>
            </div>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
                Areas for Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
            <ul className="space-y-2">
              {compatibilityScore.improvements.areas.map((categoryId) => (
                <li key={categoryId} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-2" />
                  {categories[categoryId]?.name}
<<<<<<< HEAD
                </li>
              ))}
            </ul>
=======
                  <span className="ml-auto text-sm text-amber-600 font-medium">
                    Needs Attention
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-800">
                These areas show the greatest difference in your assessments. Focus on understanding each other's perspective in these categories.
              </p>
            </div>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => window.print()}
          variant="outline"
        >
          Download Report
        </Button>
        <Button
          onClick={() => navigator.share({
            title: 'Compatibility Score',
            text: `Our compatibility score is ${compatibilityScore.overall_score.toFixed(1)}%!`,
            url: window.location.href
          })}
        >
          Share Results
        </Button>
      </div>
    </div>
  );
}