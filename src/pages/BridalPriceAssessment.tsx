import React from 'react';
import { Assessment } from './Assessment';
import { Crown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function BridalPriceAssessment() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-4xl mx-auto pt-12 px-4">
        <Card className="text-center mb-8 bg-white/80 backdrop-blur-sm border-none">
          <CardHeader>
            <Crown className="w-16 h-16 text-pink-500 mx-auto mb-4" />
            <CardTitle className="text-3xl">Bridal Price Assessment</CardTitle>
            <CardDescription className="text-lg">
              Discover your traditional value and worth
            </CardDescription>
          </CardHeader>
        </Card>
        <Assessment />
      </div>
    </div>
  );
}