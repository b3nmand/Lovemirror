import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Scale, Crown, Diamond, Brain, Heart, DollarSign, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  weight: number;
  description: string;
  assessment_type: string;
}

interface Question {
  id: string;
  category_id: string;
  question_text: string;
  min_value: number;
  max_value: number;
  assessment_type: string;
}

export function AssessmentQuestionPreview() {
  const [categories, setCategories] = useState<Record<string, Category[]>>({
    'high-value': [],
    'bridal-price': [],
    'wife-material': []
  });
  
  const [questions, setQuestions] = useState<Record<string, Question[]>>({
    'high-value': [],
    'bridal-price': [],
    'wife-material': []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'high-value' | 'bridal-price' | 'wife-material'>('high-value');
  
  useEffect(() => {
    fetchAssessmentData();
  }, []);
  
  const fetchAssessmentData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('unified_assessment_categories')
        .select('*')
        .order('weight', { ascending: false });
      
      if (categoriesError) throw categoriesError;
      
      // Fetch all questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('unified_assessment_questions')
        .select('*')
        .order('id', { ascending: true });
      
      if (questionsError) throw questionsError;
      
      // Organize by assessment type
      const categoriesByType: Record<string, Category[]> = {
        'high-value': [],
        'bridal-price': [],
        'wife-material': []
      };
      
      const questionsByType: Record<string, Question[]> = {
        'high-value': [],
        'bridal-price': [],
        'wife-material': []
      };
      
      // Group categories by assessment type
      categoriesData.forEach((category) => {
        if (categoriesByType[category.assessment_type]) {
          categoriesByType[category.assessment_type].push(category);
        }
      });
      
      // Group questions by assessment type
      questionsData.forEach((question) => {
        if (questionsByType[question.assessment_type]) {
          questionsByType[question.assessment_type].push(question);
        }
      });
      
      setCategories(categoriesByType);
      setQuestions(questionsByType);
      
      console.log('Categories loaded:', Object.keys(categoriesByType).map(key => 
        `${key}: ${categoriesByType[key].length}`
      ).join(', '));
      
      console.log('Questions loaded:', Object.keys(questionsByType).map(key => 
        `${key}: ${questionsByType[key].length}`
      ).join(', '));
      
    } catch (err) {
      console.error('Error fetching assessment data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load assessment data');
    } finally {
      setLoading(false);
    }
  };
  
  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'Mental Traits': return <Brain className="w-5 h-5 text-purple-500" />;
      case 'Emotional Traits': return <Heart className="w-5 h-5 text-pink-500" />;
      case 'Physical Traits': return <Scale className="w-5 h-5 text-blue-500" />;
      case 'Financial Traits': return <DollarSign className="w-5 h-5 text-emerald-500" />;
      case 'Family & Cultural Compatibility': return <Users className="w-5 h-5 text-amber-500" />;
      case 'Conflict Resolution Style': return <Users className="w-5 h-5 text-red-500" />;
      default: return <Users className="w-5 h-5 text-gray-500" />;
    }
  };
  
  const getAssessmentIcon = (type: string) => {
    switch (type) {
      case 'high-value': return <Scale className="w-5 h-5" />;
      case 'bridal-price': return <Crown className="w-5 h-5" />;
      case 'wife-material': return <Diamond className="w-5 h-5" />;
      default: return null;
    }
  };
  
  const getAssessmentTitle = (type: string) => {
    switch (type) {
      case 'high-value': return 'High-Value Man Assessment';
      case 'bridal-price': return 'Bridal Price Assessment';
      case 'wife-material': return 'Wife Material Assessment';
      default: return '';
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Assessment Questions Preview</CardTitle>
        <CardDescription>
          Browse all questions for each assessment type
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="high-value" className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">High-Value Man</span>
              <span className="inline sm:hidden">High-Value</span>
            </TabsTrigger>
            <TabsTrigger value="bridal-price" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">Bridal Price</span>
              <span className="inline sm:hidden">Bridal</span>
            </TabsTrigger>
            <TabsTrigger value="wife-material" className="flex items-center gap-2">
              <Diamond className="w-4 h-4" />
              <span className="hidden sm:inline">Wife Material</span>
              <span className="inline sm:hidden">Wife</span>
            </TabsTrigger>
          </TabsList>
          
          {Object.keys(categories).map((assessmentType) => (
            <TabsContent key={assessmentType} value={assessmentType} className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {getAssessmentIcon(assessmentType)}
                  {getAssessmentTitle(assessmentType)}
                </h2>
                <div className="text-sm text-muted-foreground">
                  {questions[assessmentType].length} questions in {categories[assessmentType].length} categories
                </div>
              </div>
              
              <ScrollArea className="h-[600px] pr-4">
                <Accordion type="multiple" className="w-full">
                  {categories[assessmentType].map((category) => (
                    <AccordionItem key={category.id} value={category.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category.name)}
                          <span>{category.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            (Weight: {category.weight}%)
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="text-sm text-muted-foreground mb-4">
                          {category.description}
                        </div>
                        
                        <div className="space-y-4">
                          {questions[assessmentType]
                            .filter(q => q.category_id === category.id)
                            .map((question, idx) => (
                              <Card key={question.id} className="bg-muted/40">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start gap-4">
                                    <div className="flex items-start gap-2 flex-1">
                                      <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                                        {idx + 1}
                                      </span>
                                      <div>
                                        <p className="text-sm font-medium">{question.question_text}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          Scale: {question.min_value} to {question.max_value}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={fetchAssessmentData}>
            Refresh Questions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}