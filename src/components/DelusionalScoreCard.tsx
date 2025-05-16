import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { ScoreRange } from '../types/assessment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
<<<<<<< HEAD
import { Progress } from '@/components/ui/progress';
=======
import { Progress } from '@/components/ui/progress'; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)

interface DelusionalScoreProps {
  categoryName: string;
  selfScore: number;
  externalScore: number;
  gapScore: number;
}

<<<<<<< HEAD
=======
/**
 * Get the appropriate range for a delusional score
 * @param gap The gap score between self and external assessment
 * @returns ScoreRange object with label, color, and description
 */
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
function getDelusionalRange(gap: number): ScoreRange {
  if (gap <= 10) {
    return {
      min: 0,
      max: 10,
      label: 'Highly self-aware',
      color: '#22C55E',
      description: 'Your self-perception closely matches how others see you',
    };
  } else if (gap <= 20) {
    return {
      min: 11,
      max: 20,
      label: 'Some self-blind spots',
      color: '#EAB308',
      description: 'Minor differences between self-perception and external views',
    };
  } else if (gap <= 30) {
    return {
      min: 21,
      max: 30,
      label: 'Growing self-awareness gap',
      color: '#FB923C',
      description: 'Notable differences in how you see yourself versus others',
    };
  } else {
    return {
      min: 31,
      max: 100,
      label: 'Significant misalignment',
      color: '#EF4444',
      description: 'Large gap between self-perception and external views',
    };
  }
}

<<<<<<< HEAD
=======
/**
 * Get the appropriate icon for a delusional score
 * @param gap The gap score between self and external assessment
 * @returns React element with the appropriate icon
 */
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
function getIcon(gap: number) {
  if (gap <= 10) {
    return <CheckCircle className="w-6 h-6 text-emerald-500" />;
  } else if (gap <= 20) {
    return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
  } else {
    return <XCircle className="w-6 h-6 text-red-500" />;
  }
}

export function DelusionalScoreCard({ 
  categoryName, 
  selfScore, 
  externalScore, 
  gapScore 
}: DelusionalScoreProps) {
  const range = getDelusionalRange(gapScore);

  return (
    <Card>
      <CardHeader>
<<<<<<< HEAD
        <div className="flex items-start justify-between">
=======
        <div className="flex items-start justify-between gap-2">
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
          <div>
            <CardTitle>{categoryName}</CardTitle>
            <CardDescription>Gap Score: {gapScore.toFixed(1)}%</CardDescription>
          </div>
<<<<<<< HEAD
          {getIcon(gapScore)}
=======
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>{getIcon(gapScore)}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{range.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Your Score</span>
            <span className="font-semibold">{selfScore.toFixed(1)}%</span>
          </div>
          <Progress value={selfScore} className="h-2" />
        </div>

<<<<<<< HEAD
        <div className="space-y-2">
=======
        <div className="space-y-2 mt-4">
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>External Score</span>
            <span className="font-semibold">{externalScore.toFixed(1)}%</span>
          </div>
<<<<<<< HEAD
          <Progress value={externalScore} className="h-2 bg-secondary/50" />
=======
          <Progress 
            value={externalScore} 
            className="h-2 bg-secondary/50" 
            style={{ '--progress-background': '#8b5cf6' } as React.CSSProperties}
          />
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
        </div>

        <div 
          className="mt-4 p-3 rounded-lg text-sm"
          style={{ 
            backgroundColor: `${range.color}10`,
            color: range.color,
          }}
        >
          <p className="font-medium">{range.label}</p>
<<<<<<< HEAD
          <p className="mt-1 opacity-90">{range.description}</p>
        </div>
      </CardContent>
=======
          <p className="mt-1 opacity-90 text-xs">{range.description}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          onClick={() => window.location.href = '/assessors'}
          variant="outline"
          className="w-full"
        >
          Request Assessment
        </Button>
      </CardFooter>
>>>>>>> 3f8dc85 (Initial commit of LoveMirror web app)
    </Card>
  );
}