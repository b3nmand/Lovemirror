import React from 'react';

interface AdProps {
  slot: 'sidebar' | 'results' | 'education' | 'cog-effect';
  className?: string;
}

export function Ad({ slot, className = '' }: AdProps) {
  // This would typically fetch from your ad service
  // For now, we'll use placeholder content
  const getAdContent = (slot: string) => {
    switch (slot) {
      case 'cog-effect':
        return {
          title: 'Transform Your Marriage with The Cog Effect',
          description: 'Discover the secrets to peaceful coexistence and creative conflict resolution in your relationship. The Cog Effect provides proven strategies to reignite the spark and build a thriving marriage.',
          cta: 'Get The Cog Effect on Amazon',
          bgColor: 'bg-gradient-to-br from-red-800 to-red-900',
          textColor: 'text-white',
          ctaStyle: 'bg-white text-red-900 hover:bg-red-50',
          url: 'https://www.amazon.co.uk/Cog-Effect-Romantic-Perspective-ebook/dp/B0BM8H9D12/ref=sr_1_1?dib=eyJ2IjoiMSJ9.YooGITLAvZ4UnxtE-4aHrZ935ZNHR7ETtqFoYtEUvvO7NpeZBw0JkLPn8VYinM0gp16SAxIOI7ioikVbXZVtb-EWe2Xz9LuuCQw9gBovzTmfxVZmk-5XEIqdj1_M8exAxZaHn3rFW7ByPCrWEmF0tN4J0ksZVI_UClyNzxhvRWHknBo99nSh5eyg7nXa56oPOaw3wz5ydrpeEY6nZ3Phwf1UDzK6IjjhImuBF0gzeGE.8g0WzG5dwgSbpTz-jeTCLGMqG2VNd94nRuByfzrmhAw&dib_tag=se&keywords=The+Cog+Effect&qid=1744341238&s=digital-text&sr=1-1'
        };
      case 'sidebar':
        return {
          title: 'Career & Business Ideas',
          description: 'Generate innovative business or career ideas with ProfCA',
          cta: 'Explore More',
          bgColor: 'bg-gradient-to-r from-purple-500/10 to-green-500/10',
          url: 'https://www.profca.co.uk',
          logo: 'https://i.imgur.com/Ry3Xpz4.png'
        };
      case 'results':
        return {
          title: 'Relationship Coaching',
          description: 'Get personalized advice from expert coaches',
          cta: 'Learn More',
          bgColor: 'bg-gradient-to-r from-blue-500/10 to-violet-500/10'
        };
      case 'education':
        return {
          title: 'Free Resources',
          description: 'Download our relationship guide',
          cta: 'Get Guide',
          bgColor: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10'
        };
      default:
        return {
          title: 'Sponsored',
          description: 'Advertisement',
          cta: 'Learn More',
          bgColor: 'bg-gray-100'
        };
    }
  };

  const content = getAdContent(slot);

  return (
    <div className={`rounded-xl shadow-sm overflow-hidden ${className}`}>
      <div className={`p-6 ${content.bgColor} border border-gray-200/20`}>
        <div className={`text-xs ${content.textColor || 'text-gray-500'} mb-2 opacity-75`}>Advertisement</div>
        {content.logo && (
          <img 
            src={content.logo} 
            alt="ProfCA"
            className="h-12 w-auto mb-4 mx-auto"
          />
        )}
        <h4 className={`text-lg font-semibold ${content.textColor || 'text-gray-900'} mb-2`}>{content.title}</h4>
        <p className={`text-sm ${content.textColor ? content.textColor + ' opacity-90' : 'text-gray-600'} mb-4`}>
          {content.description}
        </p>
        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-block w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center ${
            content.ctaStyle || 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {content.cta}
        </a>
      </div>
    </div>
  );
}