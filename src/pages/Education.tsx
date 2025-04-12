import React, { useState } from 'react';
import { Book, DollarSign, MessageCircle, Heart, Users, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Ad } from '@/components/Ad';

const TOPICS = [
  {
    id: 'finance',
    title: 'Financial Management',
    icon: DollarSign,
    description: 'Learn about budgeting, saving, and financial planning for couples',
    articles: [
      {
        title: 'Building Financial Trust',
        preview: 'Discover how to create transparency and trust around money...',
      },
      {
        title: 'Joint vs Separate Accounts',
        preview: 'Pros and cons of different financial arrangements...',
      },
    ],
  },
  {
    id: 'communication',
    title: 'Communication Skills',
    icon: MessageCircle,
    description: 'Master effective communication and active listening',
    articles: [
      {
        title: 'Non-Violent Communication',
        preview: 'Learn how to express needs without causing conflict...',
      },
      {
        title: 'Active Listening Techniques',
        preview: 'Improve your relationship through better listening...',
      },
    ],
  },
  {
    id: 'intimacy',
    title: 'Intimacy & Connection',
    icon: Heart,
    description: 'Build deeper emotional and physical connections',
    articles: [
      {
        title: 'Emotional Intimacy',
        preview: 'Understanding and building emotional connections...',
      },
      {
        title: 'Physical Affection',
        preview: 'The importance of non-sexual touch in relationships...',
      },
    ],
  },
  {
    id: 'culture',
    title: 'Cultural Traditions',
    icon: Users,
    description: 'Understand different cultural approaches to relationships',
    articles: [
      {
        title: 'Cross-Cultural Relationships',
        preview: 'Navigating relationships across cultural boundaries...',
      },
      {
        title: 'Traditional vs Modern Values',
        preview: 'Finding balance between cultural heritage and modern life...',
      },
    ],
  },
  {
    id: 'psychology',
    title: 'Relationship Psychology',
    icon: Brain,
    description: 'Learn about attachment styles and relationship patterns',
    articles: [
      {
        title: 'Attachment Styles',
        preview: 'Understanding how early bonds affect relationships...',
      },
      {
        title: 'Breaking Negative Patterns',
        preview: 'Identifying and changing destructive relationship cycles...',
      },
    ],
  },
];

export function Education() {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="text-center mb-12 bg-white/80 backdrop-blur-sm border-none">
          <CardHeader>
          <Book className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <CardTitle className="text-3xl">Relationship Education</CardTitle>
          <CardDescription className="text-lg">
            Explore resources to strengthen your relationship knowledge
          </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-none">
              <CardContent className="p-4">
              <nav className="space-y-2">
                {TOPICS.map(topic => {
                  const Icon = topic.icon;
                  return (
                    <Button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic)}
                      variant={selectedTopic.id === topic.id ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{topic.title}</span>
                    </Button>
                  );
                })}
              </nav>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-none">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <selectedTopic.icon className="w-6 h-6 mr-2" />
                  {selectedTopic.title}
                </CardTitle>
                <CardDescription>{selectedTopic.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ScrollArea className="h-[500px] pr-4">
                {selectedTopic.articles.map((article, index) => (
                  <Card
                    key={index}
                    className="mb-4 hover:bg-accent transition-colors cursor-pointer"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <CardDescription>{article.preview}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="link" className="px-0">
                        Read more →
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          <div className="mt-12">
            <Ad slot="education" className="max-w-lg mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}