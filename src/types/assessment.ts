export interface AssessmentType {
  id: string;
  name: string;
  description: string;
}

export interface AssessmentScore {
  id: string;
  assessment_id: string;
  type_id: string;
  category_id: string;
  score: number;
  gap_score?: number;
  created_at: string;
}

export interface ExternalAssessor {
  id: string;
  user_id: string;
  assessor_email: string;
  relationship_type: 'parent' | 'friend' | 'sibling' | 'partner';
  invitation_code: string;
  status: 'pending' | 'completed';
  created_at: string;
  completed_at?: string;
}

export interface PartnerLink {
  id: string;
  user_id: string;
  partner_code: string;
  linked_partner_id?: string;
  created_at: string;
}

export interface ScoreRange {
  min: number;
  max: number;
  label: string;
  color: string;
  description: string;
}

export interface DevelopmentPlan {
  timestamp: string;
  assessment_id: string;
  plan: string;
}

export const SCORE_RANGES: ScoreRange[] = [
  {
    min: 80,
    max: 100,
    label: 'Strong / Aligned',
    color: '#22C55E',
    description: 'Excellent alignment and self-awareness',
  },
  {
    min: 60,
    max: 79,
    label: 'Moderate / Needs Work',
    color: '#EAB308',
    description: 'Room for improvement and growth',
  },
  {
    min: 0,
    max: 59,
    label: 'Weak / At Risk',
    color: '#EF4444',
    description: 'Significant misalignment or concerns',
  },
];