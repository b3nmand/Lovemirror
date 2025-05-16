<<<<<<< HEAD
import React, { useState } from 'react';
import { Send, AlertCircle, Loader2, Mail, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
=======
import React, { useState, useEffect } from 'react';
import { Send, AlertCircle, Loader2, Mail, CheckCircle } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { inviteAssessorSchema, type InviteAssessorFormData } from '../lib/validationSchemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, SuccessAlert } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

interface InviteAssessorProps {
  onInviteSent: () => void;
}

export function InviteAssessor({ onInviteSent }: InviteAssessorProps) {
<<<<<<< HEAD
  const [email, setEmail] = useState('');
  const [inviteUrl, setInviteUrl] = useState('');
  const [relationship, setRelationship] = useState('');
=======
  const [inviteUrl, setInviteUrl] = useState('');
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
<<<<<<< HEAD

  const resetForm = () => {
    setEmail('');
    setRelationship('');
=======
  const [profile, setProfile] = useState<{ gender: string } | null>(null);
  
  // Initialize form with zod resolver
  const form = useForm<InviteAssessorFormData>({
    resolver: zodResolver(inviteAssessorSchema),
    defaultValues: {
      email: '',
      relationship: '',
      assessment_type: undefined
    }
  });
  
  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('gender')
        .eq('id', user.id)
        .single();

      setProfile(profileData);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const resetForm = () => {
    form.reset();
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    setInviteUrl('');
    setError('');
    setSuccess(false);
    setCopied(false);
  };

<<<<<<< HEAD
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
=======
  const handleSubmit = async (formData: InviteAssessorFormData) => {
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    setLoading(true);
    setError('');
    setSuccess(false);
    setInviteUrl('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

<<<<<<< HEAD
      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address');
      }

=======
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      // Check if assessor already exists
      const { data: existingAssessor } = await supabase
        .from('external_assessors')
        .select('status')
        .eq('user_id', user.id)
<<<<<<< HEAD
        .eq('assessor_email', email)
=======
        .eq('assessor_email', formData.email)
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
        .single();

      if (existingAssessor?.status === 'completed') {
        throw new Error('This assessor has already completed their assessment');
      }

<<<<<<< HEAD
      const { data: newAssessor, error: inviteError } = await supabase
        .from('external_assessors')
        .upsert({
          user_id: user.id,
          assessor_email: email,
          relationship_type: relationship,
=======
      // Determine assessment type based on gender
      const assessmentType = profile?.gender === 'female' 
        ? formData.assessment_type 
        : null;

      const { data: newAssessor, error: inviteError } = await supabase
        .from('external_assessors')
        .upsert({
          assessment_type: assessmentType,
          user_id: user.id,
          assessor_email: formData.email,
          relationship_type: formData.relationship,
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
          status: 'pending',
          created_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,assessor_email',
          returning: true
        })
        .select()
        .single();

      if (inviteError) throw inviteError;

      // Generate invite URL
      const inviteUrl = `${window.location.origin}/external-assessment/${newAssessor.invitation_code}`;
      setInviteUrl(inviteUrl);
      setSuccess(true);
<<<<<<< HEAD

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
      console.error('Invite error:', err);
=======
      form.reset();
      onInviteSent(); // Notify parent component
    } catch (err) {
      console.error('Error sending invitation:', err);
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy invite link');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite External Assessor</CardTitle>
        <CardDescription>
          Send an invitation to someone who knows you well to provide an external assessment
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      
        {success && (
<<<<<<< HEAD
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Invitation created successfully!</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Input
                type="email"
                id="email"
                placeholder="Enter assessor's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship Type</Label>
            <Select
              value={relationship}
              onValueChange={setRelationship}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Invite...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Create Invitation
              </>
            )}
          </Button>
        </form>
=======
          <SuccessAlert className="mb-4">
            Invitation created successfully!
          </SuccessAlert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter assessor's email"
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
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
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
            
            {profile?.gender === 'female' && (
              <FormField
                control={form.control}
                name="assessment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assessment Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assessment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="wife-material">Wife Material Assessment</SelectItem>
                        <SelectItem value="bridal-price">Bridal Price Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Invite...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Create Invitation
                </>
              )}
            </Button>
          </form>
        </Form>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

        {inviteUrl && (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <Label className="text-sm text-muted-foreground mb-2 block">
                Share this link with your assessor:
              </Label>
              <div className="flex gap-2">
                <Input
                  value={inviteUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  onClick={handleCopyInvite}
                  variant="outline"
                  className="shrink-0"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    'Copy'
                  )}
                </Button>
              </div>
            </div>
            <Button
              onClick={resetForm}
              variant="outline"
              className="w-full"
            >
              Create Another Invitation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}