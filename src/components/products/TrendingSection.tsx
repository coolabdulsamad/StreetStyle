
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TrendItem {
  title: string;
  description: string;
  image?: string;
  tags: string[];
}

const trendingItems: TrendItem[] = [
  {
    title: "Chunky Soles",
    description: "Oversized, chunky soles are dominating the sneaker scene, offering both style and comfort.",
    tags: ["chunky", "platform", "statement"]
  },
  {
    title: "Sustainable Materials",
    description: "Eco-friendly sneakers made from recycled materials are becoming the conscious consumer's choice.",
    tags: ["eco-friendly", "sustainable", "recycled"]
  },
  {
    title: "Tech-Infused Streetwear",
    description: "The fusion of technology and streetwear creates functional, futuristic apparel for the modern wardrobe.",
    tags: ["tech", "innovation", "functional"]
  },
  {
    title: "Retro Revival",
    description: "Classic styles from the 80s and 90s are making a strong comeback with modern updates.",
    tags: ["vintage", "classic", "nostalgic"]
  }
];

const TrendingSection: React.FC = () => {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8 text-center">Trending in Streetwear</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingItems.map((item, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] bg-muted"></div>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, i) => (
                    <Badge key={i} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
