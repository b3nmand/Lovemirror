import React from 'react';
import { Assessment } from './Assessment';
import { Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function HighValueAssessment() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto pt-12 px-4">
        <Card className="text-center mb-8 bg-white/80 backdrop-blur-sm border-none">
          <CardHeader>
            <Award className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <CardTitle className="text-3xl">High-Value Man Assessment</CardTitle>
            <CardDescription className="text-lg">
              Evaluate your value and potential in relationships
            </CardDescription>
          </CardHeader>
        </Card>
        <Assessment />
      </div>
    </div>
  );
}