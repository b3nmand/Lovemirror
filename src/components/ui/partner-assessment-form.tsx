import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './form';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { checkSubscriptionByCustomerId } from '@/lib/subscriptionUtils';

const formSchema = z.object({
  assessorEmail: z.string().email('Please enter a valid email address'),
  relationshipType: z.enum(['parent', 'friend', 'sibling', 'partner'], {
    required_error: 'Please select a relationship type',
  }),
  assessmentType: z.enum(['wife-material', 'bridal-price'], {
    required_error: 'Please select an assessment type',
  }),
});

interface PartnerAssessmentFormProps {
  invitationCode: string;
  onSubmit?: (values: z.infer<typeof formSchema>) => Promise<void>;
  isLoading?: boolean;
}

export function PartnerAssessmentForm({ invitationCode, onSubmit, isLoading = false }: PartnerAssessmentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assessorEmail: '',
      relationshipType: undefined,
      assessmentType: undefined,
    },
  });
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSubmitting(true);
      setFormError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // If user is not logged in, store invitation code and redirect to auth
        localStorage.setItem('pendingInvitationCode', invitationCode);
        localStorage.setItem('pendingAssessmentType', values.assessmentType);
        navigate(`/auth?invite=${invitationCode}`);
        return;
      }

      // Check subscription status
      let hasSubscription = false;
      try {
        hasSubscription = await checkSubscriptionByCustomerId(user.id);
        console.log('User subscription status:', hasSubscription);
      } catch (subError) {
        console.error('Error checking subscription:', subError);
        // Default to false if there's an error
        hasSubscription = false;
      }

      if (!hasSubscription) {
        console.log('User does not have an active subscription');
        // Store assessment data in localStorage
        localStorage.setItem('pendingInvitationCode', invitationCode);
        localStorage.setItem('pendingAssessmentType', values.assessmentType);
        
        // Create the assessment first
        const { data: partnerLink, error: linkError } = await supabase
          .from('partner_links')
          .select('*')
          .eq('partner_code', invitationCode)
          .single();
          
        if (linkError) {
          throw new Error('Invalid invitation code');
        }
        
        // Create a partner invitation
        const { data: invitation, error: inviteError } = await supabase
          .from('partner_invitations')
          .insert({
            sender_id: partnerLink.user_id,
            recipient_id: user.id,
            assessment_type: values.assessmentType,
            status: 'pending'
          })
          .select()
          .single();
          
        if (inviteError) {
          throw new Error('Failed to create partner invitation');
        }
        
        // Store the assessment ID
        localStorage.setItem('pendingAssessmentId', invitation.id);
        
        // Show subscription modal
        navigate('/dashboard?showSubscription=true');
        return;
      }

      // If user has subscription and onSubmit is provided, call it
      if (onSubmit) {
        await onSubmit(values);
      } else {
        // Default implementation if onSubmit is not provided
        const { data: partnerLink, error: linkError } = await supabase
          .from('partner_links')
          .select('*')
          .eq('partner_code', invitationCode)
          .single();
          
        if (linkError) {
          throw new Error('Invalid invitation code');
        }
        
        // Create a partner invitation
        const { data: invitation, error: inviteError } = await supabase
          .from('partner_invitations')
          .insert({
            sender_id: partnerLink.user_id,
            recipient_id: user.id,
            recipient_email: values.assessorEmail,
            assessment_type: values.assessmentType,
            status: 'pending'
          })
          .select()
          .single();
          
        if (inviteError) {
          throw new Error('Failed to create partner invitation');
        }
        
        // Redirect to assessment
        navigate(`/assessment?type=${values.assessmentType}&invitation=${invitation.id}`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {formError && (
          <Alert variant="destructive">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="assessorEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="relationshipType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Relationship to the Assessor</FormLabel>
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

        <FormField
          control={form.control}
          name="assessmentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assessment Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assessment type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="wife-material">Wife Material</SelectItem>
                  <SelectItem value="bridal-price">Bridal Price</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading || submitting} className="w-full">
          {isLoading || submitting ? 'Processing...' : 'Continue to Assessment'}
        </Button>
      </form>
    </Form>
  );
}