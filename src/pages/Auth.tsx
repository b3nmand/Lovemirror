import React, { useState } from 'react';
<<<<<<< HEAD
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, Mail, Lock, AlertCircle } from 'lucide-react';
=======
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Calendar, Loader2, CheckCircle } from 'lucide-react';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
<<<<<<< HEAD
import { supabase } from '../lib/supabase';
=======
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '../lib/supabase';
import { checkSubscriptionByCustomerId } from '@/lib/subscriptionUtils';
import { SubscriptionModal } from '@/components/SubscriptionModal';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

export function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
<<<<<<< HEAD
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
=======
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    country: '',
    email: '',
    password: '',
  });

<<<<<<< HEAD
=======
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [pendingAssessmentId, setPendingAssessmentId] = useState<string | null>(null);
  const invitationCode = searchParams.get('invite');
  const externalInvite = searchParams.get('externalInvite');

  React.useEffect(() => {
    // Check if there's a pending assessment ID in localStorage
    const storedAssessmentId = localStorage.getItem('pendingAssessmentId');
    if (storedAssessmentId) {
      setPendingAssessmentId(storedAssessmentId);
    }
    
    // Check if there's a pending external invitation code
    const pendingExternalInvitationCode = localStorage.getItem('pendingExternalInvitationCode');
    if (pendingExternalInvitationCode && !externalInvite) {
      // Add it to the URL params
      searchParams.set('externalInvite', pendingExternalInvitationCode);
      setSearchParams(searchParams);
    }
  }, []);

>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
<<<<<<< HEAD
=======
    setSuccess('');
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
<<<<<<< HEAD
=======
    setSuccess('');
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
<<<<<<< HEAD

    try {
      if (isSignUp && (!formData.name || !formData.age || !formData.country)) {
        throw new Error('Please fill in all required fields');
      }

      if (isSignUp) {
=======
    setSuccess('');

    try {
      if (isSignUp && (!formData.name || !formData.dob || !formData.country)) {
        throw new Error('Please fill in all required fields');
      }

      // Calculate age from date of birth
      let age = 0;
      if (formData.dob) {
        const birthDate = new Date(formData.dob);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      }

      // Verify age is at least 18
      if (isSignUp && age < 18) {
        throw new Error('You must be at least 18 years old to register');
      }

      if (isSignUp) {
        console.log('Signing up with email:', formData.email);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
<<<<<<< HEAD
              age: parseInt(formData.age),
              country: formData.country
            },
            emailRedirectTo: `${window.location.origin}/auth`,
            emailConfirmationRequired: false
          },
        });
        if (error) throw error;
        navigate('/profile-setup');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
=======
              age: age,
              country: formData.country
            },
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        });

        if (error) throw error;
        
        setSuccess('Account created successfully! Please check your email to confirm your account before signing in.');
        setIsSignUp(false);
      } else {
        console.log('Signing in with email:', formData.email);
        const { error, data: { user } } = await supabase.auth.signInWithPassword({
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select()
<<<<<<< HEAD
          .maybeSingle();
=======
          .eq('id', user.id)
          .single();
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          navigate('/profile-setup');
          return;
        }

        // If no profile exists, redirect to profile setup
        if (!profile) {
<<<<<<< HEAD
          navigate('/profile-setup');
          return;
        }

        // If profile exists, proceed to assessment
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from);
      }
    } catch (err) {
=======
          console.log('No profile found, redirecting to profile setup');
          navigate('/profile-setup');
          return; 
        }

        // Check if there's a pending invitation code
        const pendingInvitationCode = localStorage.getItem('pendingInvitationCode');
        const pendingExternalInvitationCode = localStorage.getItem('pendingExternalInvitationCode');
        
        if (pendingInvitationCode) {
          // Check subscription status
          let hasSubscription = false;
          try {
            hasSubscription = await checkSubscriptionByCustomerId(user.id);
          } catch (subError) {
            console.error('Error checking subscription:', subError);
            hasSubscription = false;
          }
          
          if (!hasSubscription) {
            // Show subscription modal
            setShowSubscriptionModal(true);
          } else {
            // Redirect to partner assessment
            navigate(`/partner-assessment/${pendingInvitationCode}`);
            
            // Clear localStorage
            localStorage.removeItem('pendingInvitationCode');
            localStorage.removeItem('pendingAssessmentType');
            localStorage.removeItem('pendingAssessmentId');
          }
        } else if (pendingExternalInvitationCode || externalInvite) {
          // Get the invitation code from either localStorage or URL params
          const inviteCode = pendingExternalInvitationCode || externalInvite;
          
          // Get the pending assessor email and relationship type
          const pendingAssessorEmail = localStorage.getItem('pendingAssessorEmail');
          const pendingRelationshipType = localStorage.getItem('pendingRelationshipType');
          
          if (pendingAssessorEmail && pendingRelationshipType) {
            // Redirect to external assessment with the stored data
            navigate(`/external-assessment/${inviteCode}`);
            
            // Clear localStorage
            localStorage.removeItem('pendingExternalInvitationCode');
            localStorage.removeItem('pendingAssessorEmail');
            localStorage.removeItem('pendingRelationshipType');
          } else {
            // Just redirect to the external assessment page
            navigate(`/external-assessment/${inviteCode}`);
          }
        } else {
          // If profile exists, proceed to dashboard
          const from = (location.state as any)?.from?.pathname || '/dashboard';
          console.log('Profile found, redirecting to:', from);
          navigate(from);
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      let errorMessage = 'An error occurred during authentication';
      
      if (err.message === 'Invalid login credentials') {
        errorMessage = 'Invalid email or password. Please try again.';
<<<<<<< HEAD
      } else if (err.message === 'Email not confirmed') {
        errorMessage = 'Please check your email to confirm your account before signing in.';
      } else if (err.message === 'Failed to fetch') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
=======
      } else if (err.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email to confirm your account before signing in.';
      } else if (err.message === 'Failed to fetch') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (err.message.includes('User already registered')) {
        errorMessage = 'This email is already registered. Please sign in instead.';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    try {
<<<<<<< HEAD
=======
      setLoading(true);
      setError('');
      setSuccess('');
      
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });
      
      if (error) throw error;
<<<<<<< HEAD
      alert('Confirmation email has been resent. Please check your inbox.');
    } catch (err) {
      setError('Failed to resend confirmation email. Please try again.');
=======
      setSuccess('Confirmation email has been sent. Please check your inbox and click the link to verify your account.');
    } catch (err) {
      setError('Failed to resend confirmation email. Please try again.');
    } finally {
      setLoading(false);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    }
  };

  const handleForgotPassword = async () => {
    try {
<<<<<<< HEAD
=======
      if (!formData.email) {
        setError('Please enter your email address');
        return;
      }
      
      setLoading(true);
      setError('');
      setSuccess('');
      
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      
      if (error) throw error;
<<<<<<< HEAD
      alert('Password reset email has been sent. Please check your inbox.');
    } catch (err) {
      setError('Failed to send password reset email. Please try again.');
=======
      setSuccess('Password reset email has been sent. Please check your inbox and follow the instructions.');
    } catch (err) {
      setError('Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-gray-800">
      <Card className="max-w-md w-full bg-black/50 backdrop-blur-sm border-gray-800">
        <CardHeader className="text-center space-y-2">
<<<<<<< HEAD
          <Heart className="w-20 h-20 text-pink-500 mx-auto mb-4" />
=======
          <img src="/lovemirror_nobg_logo.png" alt="Love Mirror Logo" className="w-20 h-20 mx-auto mb-4" />
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-pink-500 to-violet-500 bg-clip-text text-transparent">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-gray-400 text-lg">
            {isSignUp
              ? 'Sign up to start your relationship assessment'
              : 'Sign in to continue your journey'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
<<<<<<< HEAD
            <div className="bg-red-900/20 text-red-400 p-4 rounded-lg mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
=======
            <Alert variant="destructive" className="bg-red-900/20 text-red-400 border-red-800 mb-6">
              <AlertCircle className="w-5 h-5 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="bg-green-900/20 text-green-400 border-green-800 mb-6">
              <CheckCircle className="w-5 h-5 mr-2" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-2">
<<<<<<< HEAD
                  <Label htmlFor="age" className="text-gray-300">Age</Label>
                  <Input
                    type="number"
                    id="age"
                    name="age"
                    required
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter your age"
                  />
=======
                  <Label htmlFor="dob" className="text-gray-300">Date of Birth</Label>
                  <Input
                    type="date"
                    id="dob"
                    name="dob"
                    required
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white pl-10"
                  />
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400 -mt-10" />
                  </div>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-gray-300">Country</Label>
<<<<<<< HEAD
                  <Select
                    name="country"
                    value={formData.country}
                    onValueChange={(value) => handleSelectChange({ target: { name: 'country', value } })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Add country options here */}
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      {/* Add more countries as needed */}
                    </SelectContent>
                  </Select>
=======
                  <div className="relative">
                    <Select
                      name="country"
                      value={formData.country}
                      onValueChange={(value) => handleSelectChange({ target: { name: 'country', value } })}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="af">🇦🇫 Afghanistan</SelectItem>
                        <SelectItem value="al">🇦🇱 Albania</SelectItem>
                        <SelectItem value="dz">🇩🇿 Algeria</SelectItem>
                        <SelectItem value="ad">🇦🇩 Andorra</SelectItem>
                        <SelectItem value="ao">🇦🇴 Angola</SelectItem>
                        <SelectItem value="ag">🇦🇬 Antigua and Barbuda</SelectItem>
                        <SelectItem value="ar">🇦🇷 Argentina</SelectItem>
                        <SelectItem value="am">🇦🇲 Armenia</SelectItem>
                        <SelectItem value="au">🇦🇺 Australia</SelectItem>
                        <SelectItem value="at">🇦🇹 Austria</SelectItem>
                        <SelectItem value="az">🇦🇿 Azerbaijan</SelectItem>
                        <SelectItem value="bs">🇧🇸 Bahamas</SelectItem>
                        <SelectItem value="bh">🇧🇭 Bahrain</SelectItem>
                        <SelectItem value="bd">🇧🇩 Bangladesh</SelectItem>
                        <SelectItem value="bb">🇧🇧 Barbados</SelectItem>
                        <SelectItem value="by">🇧🇾 Belarus</SelectItem>
                        <SelectItem value="be">🇧🇪 Belgium</SelectItem>
                        <SelectItem value="bz">🇧🇿 Belize</SelectItem>
                        <SelectItem value="bj">🇧🇯 Benin</SelectItem>
                        <SelectItem value="bt">🇧🇹 Bhutan</SelectItem>
                        <SelectItem value="bo">🇧🇴 Bolivia</SelectItem>
                        <SelectItem value="ba">🇧🇦 Bosnia and Herzegovina</SelectItem>
                        <SelectItem value="bw">🇧🇼 Botswana</SelectItem>
                        <SelectItem value="br">🇧🇷 Brazil</SelectItem>
                        <SelectItem value="bn">🇧🇳 Brunei</SelectItem>
                        <SelectItem value="bg">🇧🇬 Bulgaria</SelectItem>
                        <SelectItem value="bf">🇧🇫 Burkina Faso</SelectItem>
                        <SelectItem value="bi">🇧🇮 Burundi</SelectItem>
                        <SelectItem value="cv">🇨🇻 Cabo Verde</SelectItem>
                        <SelectItem value="kh">🇰🇭 Cambodia</SelectItem>
                        <SelectItem value="cm">🇨🇲 Cameroon</SelectItem>
                        <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                        <SelectItem value="cf">🇨🇫 Central African Republic</SelectItem>
                        <SelectItem value="td">🇹🇩 Chad</SelectItem>
                        <SelectItem value="cl">🇨🇱 Chile</SelectItem>
                        <SelectItem value="cn">🇨🇳 China</SelectItem>
                        <SelectItem value="co">🇨🇴 Colombia</SelectItem>
                        <SelectItem value="km">🇰🇲 Comoros</SelectItem>
                        <SelectItem value="cg">🇨🇬 Congo</SelectItem>
                        <SelectItem value="cr">🇨🇷 Costa Rica</SelectItem>
                        <SelectItem value="hr">🇭🇷 Croatia</SelectItem>
                        <SelectItem value="cu">🇨🇺 Cuba</SelectItem>
                        <SelectItem value="cy">🇨🇾 Cyprus</SelectItem>
                        <SelectItem value="cz">🇨🇿 Czech Republic</SelectItem>
                        <SelectItem value="dk">🇩🇰 Denmark</SelectItem>
                        <SelectItem value="dj">🇩🇯 Djibouti</SelectItem>
                        <SelectItem value="dm">🇩🇲 Dominica</SelectItem>
                        <SelectItem value="do">🇩🇴 Dominican Republic</SelectItem>
                        <SelectItem value="ec">🇪🇨 Ecuador</SelectItem>
                        <SelectItem value="eg">🇪🇬 Egypt</SelectItem>
                        <SelectItem value="sv">🇸🇻 El Salvador</SelectItem>
                        <SelectItem value="gq">🇬🇶 Equatorial Guinea</SelectItem>
                        <SelectItem value="er">🇪🇷 Eritrea</SelectItem>
                        <SelectItem value="ee">🇪🇪 Estonia</SelectItem>
                        <SelectItem value="et">🇪🇹 Ethiopia</SelectItem>
                        <SelectItem value="fj">🇫🇯 Fiji</SelectItem>
                        <SelectItem value="fi">🇫🇮 Finland</SelectItem>
                        <SelectItem value="fr">🇫🇷 France</SelectItem>
                        <SelectItem value="ga">🇬🇦 Gabon</SelectItem>
                        <SelectItem value="gm">🇬🇲 Gambia</SelectItem>
                        <SelectItem value="ge">🇬🇪 Georgia</SelectItem>
                        <SelectItem value="de">🇩🇪 Germany</SelectItem>
                        <SelectItem value="gh">🇬🇭 Ghana</SelectItem>
                        <SelectItem value="gr">🇬🇷 Greece</SelectItem>
                        <SelectItem value="gd">🇬🇩 Grenada</SelectItem>
                        <SelectItem value="gt">🇬🇹 Guatemala</SelectItem>
                        <SelectItem value="gn">🇬🇳 Guinea</SelectItem>
                        <SelectItem value="gw">🇬🇼 Guinea-Bissau</SelectItem>
                        <SelectItem value="gy">🇬🇾 Guyana</SelectItem>
                        <SelectItem value="ht">🇭🇹 Haiti</SelectItem>
                        <SelectItem value="hn">🇭🇳 Honduras</SelectItem>
                        <SelectItem value="hu">🇭🇺 Hungary</SelectItem>
                        <SelectItem value="is">🇮🇸 Iceland</SelectItem>
                        <SelectItem value="in">🇮🇳 India</SelectItem>
                        <SelectItem value="id">🇮🇩 Indonesia</SelectItem>
                        <SelectItem value="ir">🇮🇷 Iran</SelectItem>
                        <SelectItem value="iq">🇮🇶 Iraq</SelectItem>
                        <SelectItem value="ie">🇮🇪 Ireland</SelectItem>
                        <SelectItem value="il">🇮🇱 Israel</SelectItem>
                        <SelectItem value="it">🇮🇹 Italy</SelectItem>
                        <SelectItem value="jm">🇯🇲 Jamaica</SelectItem>
                        <SelectItem value="jp">🇯🇵 Japan</SelectItem>
                        <SelectItem value="jo">🇯🇴 Jordan</SelectItem>
                        <SelectItem value="kz">🇰🇿 Kazakhstan</SelectItem>
                        <SelectItem value="ke">🇰🇪 Kenya</SelectItem>
                        <SelectItem value="ki">🇰🇮 Kiribati</SelectItem>
                        <SelectItem value="kp">🇰🇵 North Korea</SelectItem>
                        <SelectItem value="kr">🇰🇷 South Korea</SelectItem>
                        <SelectItem value="kw">🇰🇼 Kuwait</SelectItem>
                        <SelectItem value="kg">🇰🇬 Kyrgyzstan</SelectItem>
                        <SelectItem value="la">🇱🇦 Laos</SelectItem>
                        <SelectItem value="lv">🇱🇻 Latvia</SelectItem>
                        <SelectItem value="lb">🇱🇧 Lebanon</SelectItem>
                        <SelectItem value="ls">🇱🇸 Lesotho</SelectItem>
                        <SelectItem value="lr">🇱🇷 Liberia</SelectItem>
                        <SelectItem value="ly">🇱🇾 Libya</SelectItem>
                        <SelectItem value="li">🇱🇮 Liechtenstein</SelectItem>
                        <SelectItem value="lt">🇱🇹 Lithuania</SelectItem>
                        <SelectItem value="lu">🇱🇺 Luxembourg</SelectItem>
                        <SelectItem value="mg">🇲🇬 Madagascar</SelectItem>
                        <SelectItem value="mw">🇲🇼 Malawi</SelectItem>
                        <SelectItem value="my">🇲🇾 Malaysia</SelectItem>
                        <SelectItem value="mv">🇲🇻 Maldives</SelectItem>
                        <SelectItem value="ml">🇲🇱 Mali</SelectItem>
                        <SelectItem value="mt">🇲🇹 Malta</SelectItem>
                        <SelectItem value="mh">🇲🇭 Marshall Islands</SelectItem>
                        <SelectItem value="mr">🇲🇷 Mauritania</SelectItem>
                        <SelectItem value="mu">🇲🇺 Mauritius</SelectItem>
                        <SelectItem value="mx">🇲🇽 Mexico</SelectItem>
                        <SelectItem value="fm">🇫🇲 Micronesia</SelectItem>
                        <SelectItem value="md">🇲🇩 Moldova</SelectItem>
                        <SelectItem value="mc">🇲🇨 Monaco</SelectItem>
                        <SelectItem value="mn">🇲🇳 Mongolia</SelectItem>
                        <SelectItem value="me">🇲🇪 Montenegro</SelectItem>
                        <SelectItem value="ma">🇲🇦 Morocco</SelectItem>
                        <SelectItem value="mz">🇲🇿 Mozambique</SelectItem>
                        <SelectItem value="mm">🇲🇲 Myanmar</SelectItem>
                        <SelectItem value="na">🇳🇦 Namibia</SelectItem>
                        <SelectItem value="nr">🇳🇷 Nauru</SelectItem>
                        <SelectItem value="np">🇳🇵 Nepal</SelectItem>
                        <SelectItem value="nl">🇳🇱 Netherlands</SelectItem>
                        <SelectItem value="nz">🇳🇿 New Zealand</SelectItem>
                        <SelectItem value="ni">🇳🇮 Nicaragua</SelectItem>
                        <SelectItem value="ne">🇳🇪 Niger</SelectItem>
                        <SelectItem value="ng">🇳🇬 Nigeria</SelectItem>
                        <SelectItem value="no">🇳🇴 Norway</SelectItem>
                        <SelectItem value="om">🇴🇲 Oman</SelectItem>
                        <SelectItem value="pk">🇵🇰 Pakistan</SelectItem>
                        <SelectItem value="pw">🇵🇼 Palau</SelectItem>
                        <SelectItem value="pa">🇵🇦 Panama</SelectItem>
                        <SelectItem value="pg">🇵🇬 Papua New Guinea</SelectItem>
                        <SelectItem value="py">🇵🇾 Paraguay</SelectItem>
                        <SelectItem value="pe">🇵🇪 Peru</SelectItem>
                        <SelectItem value="ph">🇵🇭 Philippines</SelectItem>
                        <SelectItem value="pl">🇵🇱 Poland</SelectItem>
                        <SelectItem value="pt">🇵🇹 Portugal</SelectItem>
                        <SelectItem value="qa">🇶🇦 Qatar</SelectItem>
                        <SelectItem value="ro">🇷🇴 Romania</SelectItem>
                        <SelectItem value="ru">🇷🇺 Russia</SelectItem>
                        <SelectItem value="rw">🇷🇼 Rwanda</SelectItem>
                        <SelectItem value="kn">🇰🇳 Saint Kitts and Nevis</SelectItem>
                        <SelectItem value="lc">🇱🇨 Saint Lucia</SelectItem>
                        <SelectItem value="vc">🇻🇨 Saint Vincent and the Grenadines</SelectItem>
                        <SelectItem value="ws">🇼🇸 Samoa</SelectItem>
                        <SelectItem value="sm">🇸🇲 San Marino</SelectItem>
                        <SelectItem value="st">🇸🇹 Sao Tome and Principe</SelectItem>
                        <SelectItem value="sa">🇸🇦 Saudi Arabia</SelectItem>
                        <SelectItem value="sn">🇸🇳 Senegal</SelectItem>
                        <SelectItem value="rs">🇷🇸 Serbia</SelectItem>
                        <SelectItem value="sc">🇸🇨 Seychelles</SelectItem>
                        <SelectItem value="sl">🇸🇱 Sierra Leone</SelectItem>
                        <SelectItem value="sg">🇸🇬 Singapore</SelectItem>
                        <SelectItem value="sk">🇸🇰 Slovakia</SelectItem>
                        <SelectItem value="si">🇸🇮 Slovenia</SelectItem>
                        <SelectItem value="sb">🇸🇧 Solomon Islands</SelectItem>
                        <SelectItem value="so">🇸🇴 Somalia</SelectItem>
                        <SelectItem value="za">🇿🇦 South Africa</SelectItem>
                        <SelectItem value="ss">🇸🇸 South Sudan</SelectItem>
                        <SelectItem value="es">🇪🇸 Spain</SelectItem>
                        <SelectItem value="lk">🇱🇰 Sri Lanka</SelectItem>
                        <SelectItem value="sd">🇸🇩 Sudan</SelectItem>
                        <SelectItem value="sr">🇸🇷 Suriname</SelectItem>
                        <SelectItem value="sz">🇸🇿 Eswatini</SelectItem>
                        <SelectItem value="se">🇸🇪 Sweden</SelectItem>
                        <SelectItem value="ch">🇨🇭 Switzerland</SelectItem>
                        <SelectItem value="sy">🇸🇾 Syria</SelectItem>
                        <SelectItem value="tw">🇹🇼 Taiwan</SelectItem>
                        <SelectItem value="tj">🇹🇯 Tajikistan</SelectItem>
                        <SelectItem value="tz">🇹🇿 Tanzania</SelectItem>
                        <SelectItem value="th">🇹🇭 Thailand</SelectItem>
                        <SelectItem value="tl">🇹🇱 Timor-Leste</SelectItem>
                        <SelectItem value="tg">🇹🇬 Togo</SelectItem>
                        <SelectItem value="to">🇹🇴 Tonga</SelectItem>
                        <SelectItem value="tt">🇹🇹 Trinidad and Tobago</SelectItem>
                        <SelectItem value="tn">🇹🇳 Tunisia</SelectItem>
                        <SelectItem value="tr">🇹🇷 Turkey</SelectItem>
                        <SelectItem value="tm">🇹🇲 Turkmenistan</SelectItem>
                        <SelectItem value="tv">🇹🇻 Tuvalu</SelectItem>
                        <SelectItem value="ug">🇺🇬 Uganda</SelectItem>
                        <SelectItem value="ua">🇺🇦 Ukraine</SelectItem>
                        <SelectItem value="ae">🇦🇪 United Arab Emirates</SelectItem>
                        <SelectItem value="gb">🇬🇧 United Kingdom</SelectItem>
                        <SelectItem value="us">🇺🇸 United States</SelectItem>
                        <SelectItem value="uy">🇺🇾 Uruguay</SelectItem>
                        <SelectItem value="uz">🇺🇿 Uzbekistan</SelectItem>
                        <SelectItem value="vu">🇻🇺 Vanuatu</SelectItem>
                        <SelectItem value="va">🇻🇦 Vatican City</SelectItem>
                        <SelectItem value="ve">🇻🇪 Venezuela</SelectItem>
                        <SelectItem value="vn">🇻🇳 Vietnam</SelectItem>
                        <SelectItem value="ye">🇾🇪 Yemen</SelectItem>
                        <SelectItem value="zm">🇿🇲 Zambia</SelectItem>
                        <SelectItem value="zw">🇿🇼 Zimbabwe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email Address</Label>
              <Input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter your password"
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
<<<<<<< HEAD
              className="w-full bg-gradient-to-r from-pink-500 to-violet-500"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
=======
              className="w-full bg-gradient-to-r from-pink-500 to-violet-500 relative"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </span>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </Button>

            <div className="text-center space-y-2">
              {error === 'Email not confirmed' && (
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendConfirmation}
<<<<<<< HEAD
                  className="text-pink-500 hover:text-pink-400"
                >
=======
                  disabled={loading}
                  className="text-pink-500 hover:text-pink-400"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                  Resend confirmation email
                </Button>
              )}
              {!isSignUp && (
                <Button
                  type="button"
                  variant="link"
<<<<<<< HEAD
                  onClick={handleForgotPassword}
                  className="text-gray-400 hover:text-pink-500"
                >
=======
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setSuccess('');
                  }}
                  disabled={loading}
                  className="text-gray-400 hover:text-pink-500"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                  Forgot password?
                </Button>
              )}
              <Button
                type="button"
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
<<<<<<< HEAD
=======
                disabled={loading}
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                className="text-gray-400 hover:text-pink-500"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </Button>
            </div>
          </form>
        </CardContent>
<<<<<<< HEAD
=======
        
        {/* Subscription Modal */}
        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => {
            setShowSubscriptionModal(false);
            navigate('/dashboard');
          }}
          assessmentId={pendingAssessmentId}
        />
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      </Card>
    </div>
  );
}