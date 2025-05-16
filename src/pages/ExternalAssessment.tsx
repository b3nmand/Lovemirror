import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Loader2, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription, SuccessAlert } from '@/components/ui/alert';
import { Button as ButtonUI } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Form schema for external assessment
const formSchema = z.object({
  assessorEmail: z.string().email('Please enter a valid email address'),
  relationshipType: z.enum(['parent', 'friend', 'sibling', 'partner'], {
    required_error: 'Please select a relationship type',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function ExternalAssessment() {
  const { invitationCode } = useParams<{ invitationCode: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [targetUser, setTargetUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [assessmentType, setAssessmentType] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assessorEmail: '',
      relationshipType: undefined,
    }
  });

  useEffect(() => {
    if (invitationCode) {
      validateInvitationCode();
    } else {
      setLoading(false);
    }
  }, [invitationCode]);
  
  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data.user);
    };
    
    checkUser();
  }, []);

  const validateInvitationCode = async () => {
    try {
      setLoading(true);
      
      // Check if the invitation code is valid in external_assessors table
      const { data: assessorData, error: assessorError } = await supabase
        .from('external_assessors')
        .select('*, profiles:user_id(*)')
        .eq('invitation_code', invitationCode)
        .single();
        
      if (!assessorError && assessorData) {
        setTargetUser({
          ...assessorData.profiles,
          id: assessorData.user_id
        });
        
        setAssessmentType(assessorData.assessment_type);
        
        // Check if the assessment has already been completed
        if (assessorData.status === 'completed') {
          throw new Error('This assessment has already been completed');
        }
        
        // Pre-fill the email if it exists
        if (assessorData.assessor_email) {
          form.setValue('assessorEmail', assessorData.assessor_email);
        }
        
        // Pre-fill the relationship type if it exists
        if (assessorData.relationship_type) {
          form.setValue('relationshipType', assessorData.relationship_type as any);
        }
        
        return;
      }
      
      // If not found in external_assessors, check partner_links
      const { data: partnerData, error: partnerError } = await supabase
        .from('partner_links')
        .select('*, profiles:user_id(*)')
        .eq('partner_code', invitationCode)
        .single();
        
      if (partnerError) {
        throw new Error('Invalid invitation code');
      }
      
      setTargetUser({
        ...partnerData.profiles,
        id: partnerData.user_id
      });
      
    } catch (err) {
      console.error('Error validating invitation code:', err);
      setError(err instanceof Error ? err.message : 'Invalid invitation code');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setSubmitting(true);
      setError(null);
      
      if (!targetUser) {
        throw new Error('Target user not found');
      }
      
      // Check if user is logged in
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      
      if (!user) {
        // Store data in localStorage for after login
        localStorage.setItem('pendingExternalInvitationCode', invitationCode || '');
        localStorage.setItem('pendingAssessorEmail', values.assessorEmail);
        localStorage.setItem('pendingRelationshipType', values.relationshipType);
        
        // Redirect to auth page
        navigate(`/auth?externalInvite=${invitationCode}`);
        return;
      }
      
      // Create or update the external assessor record
      const { data: assessor, error: assessorError } = await supabase
        .from('external_assessors')
        .upsert({
          user_id: targetUser.id,
          assessor_email: values.assessorEmail,
          relationship_type: values.relationshipType,
          invitation_code: invitationCode,
          status: 'pending',
          assessment_type: assessmentType
        }, {
          onConflict: 'invitation_code',
          returning: true
        })
        .select()
        .single();
        
      if (assessorError) {
        throw assessorError;
      }
      
      // Redirect to assessment page with the assessor ID
      navigate(`/assessment?type=${assessmentType || 'high-value'}&assessorId=${assessor.id}&targetUserId=${targetUser.id}`);
      
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'Failed to process invitation');
    } finally {
      setSubmitting(false);
    }
  };

  if (!invitationCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Users className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">Invalid Invitation</CardTitle>
              <CardDescription>
                No invitation code was provided. Please check your link and try again.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Users className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">Invalid Invitation</CardTitle>
              <CardDescription>
                {error}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center mb-8 bg-white/80 backdrop-blur-sm border-none">
          <CardHeader>
            <Users className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <CardTitle className="text-3xl">External Assessment</CardTitle>
            <CardDescription className="text-lg">
              Your honest feedback helps {targetUser?.name || 'the user'} get a more accurate self-awareness assessment
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>About You</CardTitle>
            <CardDescription>
              Please provide your information to start the assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <SuccessAlert className="mb-6">
                {success}
              </SuccessAlert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="assessorEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            placeholder="email@example.com" 
                            className="pl-10" 
                            {...field} 
                          />
                        </FormControl>
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="relationshipType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Relationship to {targetUser?.name || 'the User'}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="partner">Partner</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <ButtonUI 
                  type="submit" 
                  disabled={submitting} 
                  className="w-full"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Continue to Assessment'
                  )}
                </ButtonUI>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}