import React, { useState, useEffect } from 'react';
import { Users, Mail, Trash2, RefreshCw, AlertCircle, CheckCircle, Clock, Crown, Diamond, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
<<<<<<< HEAD
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
=======
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper';
<<<<<<< HEAD
=======
import { InviteAssessor } from '@/components/InviteAssessor';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

interface Assessor {
  id: string;
  assessor_email: string;
  relationship_type: string;
  assessment_type?: string;
  status: 'pending' | 'completed';
  created_at: string;
  completed_at: string | null;
  invitation_code: string;
}

interface Profile {
  gender: string;
}

export function AssessorManagement() {
  const [assessors, setAssessors] = useState<Assessor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
<<<<<<< HEAD
  const [showInviteUrl, setShowInviteUrl] = useState<string | null>(null);
  const [copiedInviteCode, setCopiedInviteCode] = useState<string | null>(null);
  const [deleteAssessorId, setDeleteAssessorId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    relationship: '',
    assessment_type: '',
  });
  const [submitting, setSubmitting] = useState(false);
=======
  const [copiedInviteCode, setCopiedInviteCode] = useState<string | null>(null);
  const [deleteAssessorId, setDeleteAssessorId] = useState<string | null>(null);
  const [showInviteForm, setShowInviteForm] = useState(true);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

  useEffect(() => {
    fetchAssessors();
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

  const fetchAssessors = async () => {
    try {
<<<<<<< HEAD
=======
      setLoading(true);
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('external_assessors')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssessors(data || []);
    } catch (err) {
      console.error('Error fetching assessors:', err);
      setError('Failed to load assessors');
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error: inviteError } = await supabase
        .from('external_assessors')
        .insert({
          assessment_type: profile?.gender === 'female' ? formData.assessment_type : null,
          user_id: user.id,
          assessor_email: formData.email,
          relationship_type: formData.relationship,
        });

      if (inviteError) throw inviteError;

      // Fetch the newly created assessor to get the invitation code
      const { data: newAssessor, error: fetchError } = await supabase
        .from('external_assessors')
        .select('*')
        .eq('user_id', user.id)
        .eq('assessor_email', formData.email)
        .single();

      if (fetchError) throw fetchError;

      // Generate invite URL
      const inviteUrl = `${window.location.origin}/external-assessment/${newAssessor.invitation_code}`;
      setShowInviteUrl(inviteUrl);

      setSuccess('Invitation created successfully!');
      setFormData({ email: '', relationship: '', assessment_type: '' });
      fetchAssessors(); // Refresh the list
    } catch (err) {
      console.error('Error sending invitation:', err);
      setError(err.message || 'Failed to send invitation');
    } finally {
      setSubmitting(false);
    }
=======
  const handleInviteSent = () => {
    setSuccess('Invitation sent successfully!');
    fetchAssessors(); // Refresh the list
    setShowInviteForm(false); // Hide the form after successful invitation
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
  };

  const handleResendInvite = async (assessorId: string) => {
    try {
      const { error } = await supabase
        .from('external_assessors')
        .update({ created_at: new Date().toISOString() })
        .eq('id', assessorId);

      if (error) throw error;
      setSuccess('Invitation resent successfully!');
      fetchAssessors();
    } catch (err) {
      console.error('Error resending invitation:', err);
      setError('Failed to resend invitation');
    }
  };

  const handleRemoveAssessor = async (assessorId: string) => {
    try {
      const { error } = await supabase
        .from('external_assessors')
        .delete()
        .eq('id', assessorId);

      if (error) throw error;
      setSuccess('Assessor removed successfully!');
      fetchAssessors();
      setDeleteAssessorId(null);
    } catch (err) {
      console.error('Error removing assessor:', err);
      setError('Failed to remove assessor');
    }
  };

  const copyInviteCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/external-assessment/${code}`);
      setCopiedInviteCode(code);
      setTimeout(() => setCopiedInviteCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
<<<<<<< HEAD
=======
      setError('Failed to copy invite link to clipboard');
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
=======
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-2 sm:px-4">
      <div className="max-w-2xl mx-auto w-full">
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
        <Card className="text-center mb-12 bg-white/80 backdrop-blur-sm border-none">
          <CardHeader>
            <Users className="w-16 h-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl">External Assessors</CardTitle>
            <CardDescription className="text-lg">
              Invite others to provide external assessment of your traits
            </CardDescription>
          </CardHeader>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

<<<<<<< HEAD
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Invite New Assessor</CardTitle>
            <CardDescription>
              Send an invitation to someone who knows you well to provide an external assessment
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                    required
                  />
                  <Mail className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship Type</Label>
                <Select
                  value={formData.relationship}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {profile?.gender === 'female' && (
                <div className="space-y-2">
                  <Label htmlFor="assessment_type">Assessment Type</Label>
                  <Select
                    value={formData.assessment_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, assessment_type: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assessment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wife-material">
                        Wife Material Assessment
                      </SelectItem>
                      <SelectItem value="bridal-price">
                        Bridal Price Assessment
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {showInviteUrl && (
                <Card className="mt-4 bg-muted">
                  <CardContent className="p-4">
                    <Label className="text-sm text-muted-foreground">Share this link with your assessor:</Label>
                    <div className="flex mt-2">
                      <Input 
                        value={showInviteUrl} 
                        readOnly 
                        className="font-mono text-sm"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="ml-2"
                        onClick={() => copyInviteCode(showInviteUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Invitation'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
=======
        {showInviteForm ? (
          <Card className="mb-8 w-full">
            <InviteAssessor onInviteSent={handleInviteSent} />
          </Card>
        ) : (
          <div className="mb-8 flex justify-end w-full">
            <Button 
              onClick={() => setShowInviteForm(true)}
              variant="outline"
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" />
              New Invitation
            </Button>
          </div>
        )}

        <Card className="w-full">
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
          <CardHeader>
            <CardTitle>Invited Assessors</CardTitle>
            <CardDescription>
              Manage your external assessors and track their status
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {assessors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No assessors invited yet</p>
<<<<<<< HEAD
              </div>
            ) : (
              <Table>
=======
                {!showInviteForm && (
                  <Button 
                    onClick={() => setShowInviteForm(true)}
                    variant="link"
                    className="mt-2 w-full"
                  >
                    Invite your first assessor
                  </Button>
                )}
              </div>
            ) : (
              <Table className="w-full">
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessors.map((assessor) => (
                    <TableRow key={assessor.id}>
                      <TableCell className="font-medium">{assessor.assessor_email}</TableCell>
                      <TableCell>
                        <div className="capitalize">{assessor.relationship_type}</div>
                        {assessor.assessment_type && (
                          <div className="text-xs text-muted-foreground mt-1 flex items-center">
                            {assessor.assessment_type === 'wife-material' ? (
                              <>
                                <Diamond className="w-3 h-3 mr-1 text-violet-500" />
                                Wife Material
                              </>
                            ) : (
                              <>
                                <Crown className="w-3 h-3 mr-1 text-pink-500" />
                                Bridal Price
                              </>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          assessor.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {assessor.status === 'completed' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {assessor.status}
                        </span>
                      </TableCell>
                      <TableCell>
<<<<<<< HEAD
                        <div className="flex space-x-2">
=======
                        <div className="flex space-x-2 w-full">
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
                          <TooltipWrapper content="Copy invite link">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => copyInviteCode(assessor.invitation_code)}
                            >
                              {copiedInviteCode === assessor.invitation_code ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </TooltipWrapper>
                          
                          {assessor.status === 'pending' && (
                            <TooltipWrapper content="Resend invitation">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleResendInvite(assessor.id)}
                              >
                                <RefreshCw className="h-4 w-4 text-blue-500" />
                              </Button>
                            </TooltipWrapper>
                          )}
                          
                          <TooltipWrapper content="Remove assessor">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setDeleteAssessorId(assessor.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TooltipWrapper>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
<<<<<<< HEAD
=======
          
          {assessors.length > 0 && (
            <CardFooter className="flex justify-between w-full">
              <div className="text-sm text-muted-foreground">
                {assessors.filter(a => a.status === 'completed').length} of {assessors.length} assessments completed
              </div>
              {!showInviteForm && (
                <Button 
                  onClick={() => setShowInviteForm(true)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  New Invitation
                </Button>
              )}
            </CardFooter>
          )}
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
        </Card>
      </div>

      {/* Delete Assessor Confirmation */}
      <DeleteConfirmationDialog
        open={!!deleteAssessorId}
        onOpenChange={() => setDeleteAssessorId(null)}
        title="Remove Assessor"
        description="Are you sure you want to remove this assessor? This will delete all their assessment data."
        onConfirm={() => deleteAssessorId && handleRemoveAssessor(deleteAssessorId)}
      />
    </div>
  );
}