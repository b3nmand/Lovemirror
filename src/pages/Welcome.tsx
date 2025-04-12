import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Scale, Crown, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Card className="max-w-md w-full bg-black/20 backdrop-blur-sm border-gray-800">
        <CardHeader className="text-center space-y-2">
          <Heart className="w-20 h-20 text-pink-500 mx-auto mb-4" />
          <CardTitle className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">
            Discover Your True Value
          </CardTitle>
          <CardDescription className="text-gray-400 text-base sm:text-lg">
            Your journey to understanding and improving your relationship value starts here
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <Card className="bg-white/10 backdrop-blur-sm border-gray-800/50">
            <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-pink-100 p-3 rounded-full">
                <Scale className="w-8 h-8 text-pink-500" />
              </div>
              <div className="text-left">
                <CardTitle className="text-white text-lg">High-Value Man Assessment</CardTitle>
                <CardDescription className="text-gray-400">For men seeking to understand and improve their value</CardDescription>
              </div>
            </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-gray-800/50">
            <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Crown className="w-8 h-8 text-purple-500" />
              </div>
              <div className="text-left">
                <CardTitle className="text-white text-lg">Bridal Price Estimator</CardTitle>
                <CardDescription className="text-gray-400">Traditional African bridal value assessment</CardDescription>
              </div>
            </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-gray-800/50">
            <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-violet-100 p-3 rounded-full">
                <Gem className="w-8 h-8 text-violet-500" />
              </div>
              <div className="text-left">
                <CardTitle className="text-white text-lg">Wife Material Assessment</CardTitle>
                <CardDescription className="text-gray-400">Modern relationship readiness evaluation</CardDescription>
              </div>
            </div>
            </CardContent>
          </Card>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button
              onClick={() => navigate('/auth')}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 text-white font-semibold hover:opacity-90 transition-opacity"
              size="lg"
            >
              Start Your Assessment
            </Button>
            <p className="text-center text-sm text-gray-500">
              Your data is secure and your privacy is our priority
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}