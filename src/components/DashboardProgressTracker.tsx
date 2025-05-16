import React from 'react';
import { useProgress } from '@/contexts/ProgressContext';
import { CheckCircle, Info, Circle, Sparkles, Star, Heart, User } from 'lucide-react';
import clsx from 'clsx';

const milestoneOrder = [
  { key: 'selfAssessment', title: 'Complete your Self-Assessment', help: 'Start your journey by answering all self-assessment questions.' },
  { key: 'subscribe', title: 'Subscribe to unlock results', help: 'Gain access to your personalized results and insights.' },
  { key: 'invitePartner', title: 'Invite your partner', help: 'Send an invite to your partner to complete their assessment.' },
  { key: 'compatibilityScore', title: 'Receive Compatibility Score', help: 'See how you and your partner align.' },
  { key: 'inviteAssessors', title: 'Invite external assessors', help: 'Get feedback from friends or family.' },
  { key: 'activateGoals', title: 'Activate AI Goals Plan', help: 'Unlock your personalized growth plan.' },
] as const;

type MilestoneKey = typeof milestoneOrder[number]['key'];

export function DashboardProgressTracker() {
  const progress = useProgress();

  if (!progress || !progress.milestones) return null;

  const completedCount = milestoneOrder.filter(m => progress.milestones[m.key]?.completed).length;

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-2 sm:px-4">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 bg-clip-text text-transparent flex items-center gap-2">
          <Sparkles className="w-7 h-7 animate-pulse text-yellow-400" />
          Your Progress
        </h2>
        <span className="text-base sm:text-lg font-semibold text-pink-600">
          {completedCount} of {milestoneOrder.length} Complete
        </span>
      </div>
      <div className="relative flex items-center mb-12 overflow-x-auto scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent">
        {/* Progress Bar Background */}
        <div className="absolute left-0 right-0 h-4 rounded-full bg-gradient-to-r from-pink-200 via-purple-200 to-yellow-100 shadow-lg" />
        {/* Progress Bar Foreground */}
        <div
          className="absolute left-0 h-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 shadow-xl transition-all duration-700"
          style={{ width: `${(completedCount / milestoneOrder.length) * 100}%` }}
        />
        {/* Milestone Icons */}
        <div className="flex w-full justify-between z-10">
          {milestoneOrder.map((milestone, idx) => (
            <div key={milestone.key} className="flex flex-col items-center w-1/5">
              <div className={`rounded-full p-2 mb-2 shadow-lg transition-all duration-300 ${idx < completedCount ? 'bg-gradient-to-br from-pink-500 to-yellow-400' : 'bg-gray-200'}`}>
                {idx < completedCount ? (
                  <CheckCircle className="w-7 h-7 text-white drop-shadow" />
                ) : (
                  <Circle className="w-7 h-7 text-gray-400" />
                )}
              </div>
              <span className={`text-xs font-semibold ${idx < completedCount ? 'text-pink-600' : 'text-gray-400'}`}>{milestone.title}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Milestone Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {milestoneOrder.map((milestone, idx) => (
          <div
            key={milestone.key}
            className={`rounded-xl p-6 shadow-xl border-2 transition-all duration-300 ${idx < completedCount
              ? 'bg-gradient-to-br from-pink-100 via-yellow-50 to-purple-100 border-pink-400 scale-105'
              : 'bg-white border-gray-200'} ${idx === completedCount ? 'animate-pulse' : ''}`}
          >
            <div className="flex items-center gap-3 mb-2">
              {milestone.icon || <User className="w-6 h-6 text-pink-400" />}
              <span className={`text-lg font-bold ${idx < completedCount ? 'text-pink-700' : 'text-gray-500'}`}>{milestone.title}</span>
              {idx < completedCount && <CheckCircle className="w-5 h-5 text-green-500 ml-2" />}
            </div>
            <p className="text-sm text-gray-700 mb-1">{milestone.help}</p>
            {/* Completion date tooltip */}
            {idx < completedCount && progress.milestones[milestone.key as MilestoneKey]?.completedAt && (
              <div className="text-xs text-purple-500 italic mt-1">
                Completed on {progress.milestones[milestone.key as MilestoneKey]?.completedAt}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 