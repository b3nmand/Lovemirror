import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { User, Heart, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
=======
import { User, Heart, AlertCircle, Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { profileSchema, type ProfileFormData } from '../lib/validationSchemas';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
<<<<<<< HEAD

interface FormErrors {
  [key: string]: string;
}

export function ProfileSetup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    region: '',
    culturalContext: 'global',
  });
  const [error, setError] = useState<string>('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors: FormErrors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.age || parseInt(formData.age) < 18) {
      errors.age = 'You must be at least 18 years old';
    }
    
    if (!formData.gender) {
      errors.gender = 'Please select your gender';
    }
    
    if (!formData.region) {
      errors.region = 'Please select your region';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      setError('Please complete all required fields');
      return;
    }
    
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
=======
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export function ProfileSetup() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Initialize form with zod resolver
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      age: undefined,
      gender: undefined,
      region: undefined,
      culturalContext: 'global',
    }
  });

  const handleSubmit = async (formData: ProfileFormData) => {
    setError('');
    setLoading(true);
    console.log('Submitting profile data:', formData);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No user found during profile setup');
        throw new Error('No user found. Please sign in again.');
      }
      
      console.log('Creating profile for user ID:', user.id);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: formData.name,
<<<<<<< HEAD
          age: parseInt(formData.age),
=======
          age: formData.age,
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
          gender: formData.gender,
          region: formData.region,
          cultural_context: formData.culturalContext,
          updated_at: new Date().toISOString(),
        });

<<<<<<< HEAD
      if (profileError) throw profileError;
      
=======
      if (profileError) {
        console.error('Error creating profile:', profileError);
        throw profileError;
      }
      
      console.log('Profile created successfully, redirecting to dashboard');
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
=======
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <img src="/lovemirror_nobg_logo.png" alt="Love Mirror Logo" className="w-16 h-16 mx-auto mb-4" />
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
          <CardTitle className="text-3xl">Complete Your Profile</CardTitle>
          <CardDescription>Tell us about yourself to get personalized insights</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
<<<<<<< HEAD

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={formErrors.name ? 'border-red-500' : ''}
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                type="number"
                id="age"
                name="age"
                min="18"
                max="100"
                value={formData.age}
                onChange={handleInputChange}
                className={formErrors.age ? 'border-red-500' : ''}
              />
              {formErrors.age && (
                <p className="text-sm text-red-500">{formErrors.age}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange('gender', value)}
              >
                <SelectTrigger className={formErrors.gender ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.gender && (
                <p className="text-sm text-red-500">{formErrors.gender}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => handleSelectChange('region', value)}
              >
                <SelectTrigger className={formErrors.region ? 'border-red-500' : ''}>
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
              {formErrors.region && (
                <p className="text-sm text-red-500">{formErrors.region}</p>
              )}
            </div>

            {formData.gender === 'female' && formData.region === 'africa' && (
              <div className="space-y-2">
                <Label htmlFor="culturalContext">Cultural Context</Label>
                <Select
                  value={formData.culturalContext}
                  onValueChange={(value) => handleSelectChange('culturalContext', value)}
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

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Setting Up Your Profile...
                </div>
              ) : (
                'Continue to Assessment'
              )}
            </Button>
          </form>
=======
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField 
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="18" 
                        max="120" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> 
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem> 
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="africa">Africa</SelectItem>
                        <SelectItem value="asia">Asia</SelectItem> 
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="north_america">North America</SelectItem>
                        <SelectItem value="south_america">South America</SelectItem>
                        <SelectItem value="oceania">Oceania</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> 
              
              {form.watch('gender') === 'female' && form.watch('region') === 'africa' && (
                <FormField
                  control={form.control}
                  name="culturalContext"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cultural Context</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cultural context" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="global">Global Context</SelectItem>
                          <SelectItem value="african">African Context</SelectItem> 
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <Button
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Setting Up Your Profile...
                  </div>
                ) : ( 
                  'Continue to Assessment'
                )}
              </Button>
            </form>
          </Form>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
        </CardContent>
      </Card>
    </div>
  );
}