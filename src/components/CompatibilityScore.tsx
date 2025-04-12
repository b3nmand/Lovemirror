import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Send, AlertCircle, CheckCircle, Clock, Crown, Diamond } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CircularProgress } from './CircularProgress';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
}

interface Category {
  id: string;
  name: string;
  description: string;
}

export function CompatibilityScore() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [compatibilityScore, setCompatibilityScore] = useState<CompatibilityScore | null>(null);
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<'wife-material' | 'bridal-price' | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSending, setInviteSending] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchCategories();
  }, []);

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

  const handleAssessmentSelect = (type: 'wife-material' | 'bridal-price') => {
    setSelectedAssessmentType(type);
    setShowAssessmentModal(false);
    setShowInviteModal(true);
  };

  const handleInvitePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteSending(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (!selectedAssessmentType && profile?.gender === 'female') {
        throw new Error('Please select an assessment type');
      }

      const assessmentType = profile?.gender === 'male' ? 'high-value' : selectedAssessmentType;

      const { data: invitation, error } = await supabase
        .from('partner_invitations')
        .insert({
          sender_id: user.id,
          recipient_id: null,
          assessment_type: assessmentType
        })
        .select()
        .single();

      if (error) throw error;

      setShowInviteModal(false);
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
        <CircularProgress />
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
              size="lg"
            >
              <Send className="w-5 h-5 mr-2" />
              Send Partner Invitation
            </Button>
          </CardContent>
        </Card>

          {/* Assessment Type Selection Modal */}
          {showAssessmentModal && profile?.gender === 'female' && (
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
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowInviteModal(false);
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
                </form>
              </DialogContent>
            </Dialog>
          )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-12 bg-white/80 backdrop-blur-sm border-none">
        <CardHeader className="text-center">
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
                    className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                    style={{ width: `${category.compatibility}%` }}
                  />
                </div>
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
                </li>
              ))}
            </ul>
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
                </li>
              ))}
            </ul>
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