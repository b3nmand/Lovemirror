import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
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
=======
import { supabase } from '@/lib/supabase';
import { 
  User, 
  Bell,
  Shield,
  CreditCard, 
  LogOut, 
  Save, 
  Trash2, 
  AlertCircle, 
  CheckCircle,
  Mail, 
  Send,
  Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LinkSubscription } from '@/components/LinkSubscription';

export function Settings() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date_of_birth: '',
    gender: '',
    region: '',
    cultural_context: '',
    notifications: true,
    currency: 'USD',
    regional_pricing: true,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [subscription, setSubscription] = useState<any>(null);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
<<<<<<< HEAD
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

=======
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Check if email is verified
      setEmailVerified(!!user.email_confirmed_at);

>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
<<<<<<< HEAD
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
=======

      // Fetch settings data
      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Fetch subscription data
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      setProfile(profileData);
      setSubscription(subscriptionData);
      
      // Format date of birth if it exists
      const dob = profileData?.date_of_birth ? new Date(profileData.date_of_birth).toISOString().split('T')[0] : '';
      
      setFormData({
        name: profileData?.name || '',
        email: user.email || '',
        date_of_birth: dob,
        gender: profileData?.gender || '',
        region: profileData?.region || '',
        cultural_context: profileData?.cultural_context || 'global',
        notifications: settingsData?.notifications !== false,
        currency: settingsData?.currency || 'USD',
        regional_pricing: settingsData?.regional_pricing !== false,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data');
    } finally {
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      setLoading(false);
    }
  };

<<<<<<< HEAD
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
=======
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setError('');
      setSuccess('');
      setSaving(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          region: formData.region,
          cultural_context: formData.cultural_context,
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

<<<<<<< HEAD
      if (updateError) throw updateError;
      setSuccess('Settings saved successfully!');
=======
      if (profileError) throw profileError;

      // Update settings
      const { error: settingsError } = await supabase
        .from('settings')
        .upsert({
          user_id: user.id,
          notifications: formData.notifications,
          currency: formData.currency,
          regional_pricing: formData.regional_pricing,
          updated_at: new Date().toISOString()
        });

      if (settingsError) throw settingsError;

      setSuccess('Settings saved successfully');
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

<<<<<<< HEAD
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
=======
  const handleResendVerification = async () => {
    try {
      setVerifyingEmail(true);
      setError('');
      setSuccess('');
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });
      
      if (error) throw error;
      
      setSuccess('Verification email has been sent. Please check your inbox.');
    } catch (err) {
      console.error('Error sending verification email:', err);
      setError('Failed to send verification email. Please try again.');
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setError('');
      setSuccess('');
      setSaving(true);

      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (error) throw error;

      setSuccess('Password changed successfully');
      setShowPasswordDialog(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setError('');
      setSuccess('');
      setSaving(true);

      // This is a placeholder - in a real app, you would implement proper account deletion
      // This would typically involve:
      // 1. Cancelling any active subscriptions
      // 2. Deleting user data from all tables
      // 3. Finally deleting the auth user

      setShowDeleteDialog(false);
      // In a real implementation, you would sign out and redirect to home page
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out');
    }
  };

<<<<<<< HEAD
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
=======
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="text-center mb-8 bg-white/80 backdrop-blur-sm border-none">
          <CardHeader>
            <User className="w-16 h-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl">Account Settings</CardTitle>
            <CardDescription className="text-lg">
              Manage your profile, preferences, and account settings
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
            </CardDescription>
          </CardHeader>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
<<<<<<< HEAD
=======
            <AlertCircle className="h-4 w-4" />
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
<<<<<<< HEAD
=======
            <CheckCircle className="h-4 w-4" />
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

<<<<<<< HEAD
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
=======
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                      />
                      {!emailVerified && (
                        <Button
                          variant="outline"
                          onClick={handleResendVerification}
                          disabled={verifyingEmail}
                        >
                          {verifyingEmail ? 'Sending...' : 'Verify'}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange('gender', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Select
                      value={formData.region}
                      onValueChange={(value) => handleSelectChange('region', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="africa">Africa</SelectItem>
                        <SelectItem value="asia">Asia</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="north_america">North America</SelectItem>
                        <SelectItem value="south_america">South America</SelectItem>
                        <SelectItem value="oceania">Oceania</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.region === 'africa' && (
                    <div className="space-y-2">
                      <Label htmlFor="cultural_context">Cultural Context</Label>
                      <Select
                        value={formData.cultural_context}
                        onValueChange={(value) => handleSelectChange('cultural_context', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select cultural context" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="global">Global Context</SelectItem>
                          <SelectItem value="african">African Context</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-gradient-to-r from-pink-500 to-purple-500"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications about your assessments and results
                      </p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={formData.notifications}
                      onCheckedChange={(checked) => handleSwitchChange('notifications', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="regional_pricing">Regional Pricing</Label>
                      <p className="text-sm text-muted-foreground">
                        Adjust pricing based on your region
                      </p>
                    </div>
                    <Switch
                      id="regional_pricing"
                      checked={formData.regional_pricing}
                      onCheckedChange={(checked) => handleSwitchChange('regional_pricing', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="currency">Preferred Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => handleSelectChange('currency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="NGN">Nigerian Naira (NGN)</SelectItem>
                        <SelectItem value="KES">Kenyan Shilling (KES)</SelectItem>
                        <SelectItem value="ZAR">South African Rand (ZAR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-gradient-to-r from-pink-500 to-purple-500"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
                <CardDescription>
                  View and manage your subscription details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {subscription ? (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold">{subscription.plan.replace('_', ' ')}</p>
                          <p className="text-sm text-muted-foreground">
                            Status: <span className="capitalize">{subscription.status}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Renews on</p>
                          <p className="font-medium">
                            {new Date(subscription.current_period_end).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Payment History</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>{new Date(subscription.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {subscription.plan === '1_month' ? '£9.99' : 
                               subscription.plan === '3_months' ? '£15.00' : '£36.00'}
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Paid
                              </span>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button variant="outline">
                        Manage Billing
                      </Button>
                      <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        Cancel Subscription
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
                    <p className="text-gray-500 mb-6">
                      You don't have an active subscription. Subscribe to unlock premium features.
                    </p>
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-500">
                      View Subscription Plans
                    </Button>
                    
                    <div className="mt-8 pt-8 border-t border-gray-200">
                      <LinkSubscription onSuccess={fetchUserData} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your account security and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium">Email Address</h3>
                      <p className="text-sm text-muted-foreground">{formData.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {emailVerified ? 
                          <span className="text-green-500 flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" /> Verified
                          </span> : 
                          <span className="text-amber-500 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" /> Not verified
                          </span>
                        }
                      </p>
                    </div>
                    {!emailVerified && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleResendVerification}
                        disabled={verifyingEmail}
                      >
                        {verifyingEmail ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Verify Email
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-medium">Password</h3>
                      <p className="text-sm text-muted-foreground">Last updated: Never</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowPasswordDialog(true)}
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Change
                    </Button>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-base font-medium">Account Management</h3>
                    <div className="flex flex-col space-y-2">
                      <Button 
                        variant="outline" 
                        onClick={handleSignOut}
                        className="justify-start"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 justify-start"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Change Password Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter your current password and a new password to update your credentials.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowPasswordDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleChangePassword}
                disabled={saving}
                className="bg-gradient-to-r from-pink-500 to-purple-500"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={saving}
                variant="destructive"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Account'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      </div>
    </div>
  );
}