import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  ClipboardList,
  CreditCard,
  Lock,
  Sliders,
  Brain,
  Save,
  LogOut,
  Moon,
  Sun,
  Bell,
  Globe,
  Languages,
  Trash2,
  RefreshCw,
  FileText,
  XCircle,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface UserProfile {
  full_name: string;
  email: string;
  date_of_birth?: string;
  gender?: string;
  communication_style?: 'empathetic' | 'direct' | 'playful';
  relationship_goals?: 'marriage' | 'self-growth' | 'fun-dating' | 'healing';
  notifications_enabled: boolean;
  dark_mode: boolean;
  sound_effects: boolean;
  language: string;
  profile_visibility: 'public' | 'private';
}

interface Subscription {
  plan: string;
  status: string;
  current_period_end: string;
}

export function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    email: '',
    notifications_enabled: true,
    dark_mode: false,
    sound_effects: true,
    language: 'en',
    profile_visibility: 'private'
  });
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [assessmentCount, setAssessmentCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile({
        ...profile,
        ...profileData,
        email: user.email || ''
      });

      // Fetch subscription data
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!subError && subData) {
        setSubscription(subData);
      }

      // Fetch assessment count
      const { data: assessments, error: assessmentError } = await supabase
        .from('assessment_history')
        .select('id')
        .eq('user_id', user.id);

      if (!assessmentError) {
        setAssessmentCount(assessments?.length || 0);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load user data');
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          date_of_birth: profile.date_of_birth,
          gender: profile.gender,
          communication_style: profile.communication_style,
          relationship_goals: profile.relationship_goals,
          notifications_enabled: profile.notifications_enabled,
          dark_mode: profile.dark_mode,
          sound_effects: profile.sound_effects,
          language: profile.language,
          profile_visibility: profile.profile_visibility,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;
      setSuccess('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Delete user data from all tables
      await supabase.from('profiles').delete().eq('id', user.id);
      await supabase.from('assessment_history').delete().eq('user_id', user.id);
      await supabase.from('subscriptions').delete().eq('user_id', user.id);

      // Delete auth user
      await supabase.auth.admin.deleteUser(user.id);
      
      // Sign out and redirect
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account');
    }
    setShowDeleteModal(false);
  };

  const handleResetProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await supabase.from('assessment_history').delete().eq('user_id', user.id);
      setAssessmentCount(0);
      setSuccess('Assessment progress has been reset');
    } catch (err) {
      console.error('Error resetting progress:', err);
      setError('Failed to reset progress');
    }
    setShowResetModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 space-y-8">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center mb-12">
          <CardHeader>
            <SettingsIcon className="w-16 h-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl">Settings</CardTitle>
            <CardDescription>
              Manage your account, preferences, and subscription
            </CardDescription>
          </CardHeader>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Account Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-6 h-6 mr-2 text-primary" />
              Account Information
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={profile.date_of_birth}
                  onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={profile.gender}
                  onValueChange={(value) => setProfile({ ...profile, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Prefer not to say</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessment & Results */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardList className="w-6 h-6 mr-2 text-primary" />
              Assessment & Results
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Completed Assessments</h3>
                <p className="text-sm text-muted-foreground">{assessmentCount} assessments taken</p>
              </div>
              <Button
                onClick={() => setShowResetModal(true)}
                variant="destructive"
                size="sm"
              >
                Reset Progress
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscription & Billing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-6 h-6 mr-2 text-primary" />
              Subscription & Billing
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {subscription ? (
              <div className="space-y-4">
                <Card className="bg-muted">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{subscription.plan}</h3>
                        <p className="text-sm text-muted-foreground">
                          Expires: {new Date(subscription.current_period_end).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        subscription.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {subscription.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex space-x-4">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    View Invoices
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center text-destructive">
                    <XCircle className="w-4 h-4 mr-1" />
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No active subscription</p>
                <Button variant="link" className="mt-2">
                  View Plans
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy & Permissions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="w-6 h-6 mr-2 text-primary" />
              Privacy & Permissions
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile_visibility">Profile Visibility</Label>
              <Select
                value={profile.profile_visibility}
                onValueChange={(value) => setProfile({ 
                  ...profile, 
                  profile_visibility: value as 'public' | 'private' 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => setShowDeleteModal(true)}
              variant="destructive"
              className="flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sliders className="w-6 h-6 mr-2 text-primary" />
              App Preferences
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <Label htmlFor="notifications">Notifications</Label>
              </div>
              <Switch
                id="notifications"
                checked={profile.notifications_enabled}
                onCheckedChange={(checked) => setProfile({ ...profile, notifications_enabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {profile.dark_mode ? (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Sun className="w-5 h-5 text-muted-foreground" />
                )}
                <Label htmlFor="dark_mode">Dark Mode</Label>
              </div>
              <Switch
                id="dark_mode"
                checked={profile.dark_mode}
                onCheckedChange={(checked) => setProfile({ ...profile, dark_mode: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="flex items-center">
                <Languages className="w-5 h-5 mr-2 text-muted-foreground" />
                Language
              </Label>
              <Select
                value={profile.language}
                onValueChange={(value) => setProfile({ ...profile, language: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* AI Personalization */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-6 h-6 mr-2 text-primary" />
              AI Personalization
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="communication_style">Communication Style</Label>
              <Select
                value={profile.communication_style}
                onValueChange={(value) => setProfile({ 
                  ...profile, 
                  communication_style: value as 'empathetic' | 'direct' | 'playful'
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select communication style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empathetic">Empathetic</SelectItem>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="playful">Playful</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship_goals">Relationship Goals</Label>
              <Select
                value={profile.relationship_goals}
                onValueChange={(value) => setProfile({ 
                  ...profile, 
                  relationship_goals: value as 'marriage' | 'self-growth' | 'fun-dating' | 'healing'
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship goals" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marriage">Marriage</SelectItem>
                  <SelectItem value="self-growth">Self Growth</SelectItem>
                  <SelectItem value="fun-dating">Fun Dating</SelectItem>
                  <SelectItem value="healing">Healing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="flex items-center"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Log Out
          </Button>

          <Button
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center"
          >
            {saving ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <div className="text-center mt-4 text-sm text-muted-foreground">
          Version 1.0.0
        </div>

        {/* Delete Account Modal */}
        <DeleteConfirmationDialog
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
          title="Delete Account"
          description="Are you sure you want to delete your account? This action cannot be undone."
          onConfirm={handleDeleteAccount}
        />

        {/* Reset Progress Modal */}
        <ConfirmationDialog
          open={showResetModal}
          onOpenChange={setShowResetModal}
          title="Reset Progress"
          description="Are you sure you want to reset all your assessment progress? This will delete all your assessment history."
          confirmText="Reset Progress"
          variant="destructive"
          onConfirm={handleResetProgress}
        />
      </div>
    </div>
  );
}