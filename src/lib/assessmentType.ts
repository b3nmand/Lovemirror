import type { Profile } from '../types/profile';

export function getAssessmentType(profile: Profile | null): string {
  if (!profile) return 'high-value'; // Default to high-value if no profile
  
  let assessmentType = 'high-value';
  if (profile.gender === 'male') {
    assessmentType = 'high-value';
  } else {
    // For female users
    assessmentType = profile.region === 'africa' && profile.cultural_context === 'african'
      ? 'bridal-price'
      : 'wife-material';
  }
  
  console.log('Determined assessment type:', assessmentType, 'for profile:', {
    gender: profile.gender,
    region: profile.region,
    cultural_context: profile.cultural_context
  });

  return assessmentType;
}