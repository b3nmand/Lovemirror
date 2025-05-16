import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PartnerAssessmentForm } from '@/components/ui/partner-assessment-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function PartnerAssessment() {
  const { invitationCode } = useParams<{ invitationCode: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partnerLink, setPartnerLink] = useState<any>(null);
  const [inviterName, setInviterName] = useState<string | null>(null);

  useEffect(() => {
    if (invitationCode) {
      validateInvitationCode();
    } else {
      setLoading(false);
    }
  }, [invitationCode]);

  const validateInvitationCode = async () => {
    try {
      setLoading(true);
      
      // Check if the invitation code is valid
      const { data, error: linkError } = await supabase
        .from('partner_links')
        .select('*, profiles:user_id(*)')
        .eq('partner_code', invitationCode)
        .single();
        
      if (linkError) {
        throw new Error('Invalid invitation code');
      }
      
      // Get the inviter's name if available
      if (data.profiles && data.profiles.name) {
        setInviterName(data.profiles.name);
      }
      
      setPartnerLink(data);
    } catch (err) {
      console.error('Error validating invitation code:', err);
      setError(err instanceof Error ? err.message : 'Invalid invitation code');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // This should be handled by the form component
        return;
      }
      
      // Update partner link with the linked partner ID
      const { error: updateError } = await supabase
        .from('partner_links')
        .update({ linked_partner_id: user.id })
        .eq('partner_code', invitationCode);
        
      if (updateError) {
        throw updateError;
      }
      
      // Create a partner invitation
      const { data: invitation, error: inviteError } = await supabase
        .from('partner_invitations')
        .insert({
          sender_id: partnerLink.user_id,
          recipient_id: user.id,
          recipient_email: formData.assessorEmail,
          assessment_type: formData.assessmentType,
          status: 'accepted'
        })
        .select()
        .single();
        
      if (inviteError) {
        throw inviteError;
      }
      
      // Redirect to assessment
      navigate(`/assessment?type=${formData.assessmentType}&invitation=${invitation.id}`);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'Failed to process invitation');
    }
  };

  if (!invitationCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center mb-8 bg-white/80 backdrop-blur-sm border-none">
          <CardHeader>
            <img src="/lovemirror_nobg_logo.png" alt="Love Mirror Logo" className="w-16 h-16 mx-auto mb-4" />
            <CardTitle className="text-3xl">Partner Assessment</CardTitle>
            <CardDescription className="text-lg">
              {inviterName 
                ? `${inviterName} has invited you to take a relationship compatibility assessment` 
                : 'Your feedback helps provide a more accurate relationship assessment'}
            </CardDescription>
          </CardHeader>
        </Card>
        
        <PartnerAssessmentForm 
          invitationCode={invitationCode} 
          onSubmit={handleFormSubmit}
        />
      </div>
    </div>
  );
}