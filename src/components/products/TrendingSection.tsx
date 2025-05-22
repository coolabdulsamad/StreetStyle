
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface TrendItem {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
}

const trendingItems: TrendItem[] = [
  {
    title: "Chunky Soles",
    description: "Oversized, chunky soles are dominating the sneaker scene, offering both style and comfort.",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80",
    tags: ["chunky", "platform", "statement"],
    link: "/products/sneakers"
  },
  {
    title: "Sustainable Materials",
    description: "Eco-friendly sneakers made from recycled materials are becoming the conscious consumer's choice.",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    tags: ["eco-friendly", "sustainable", "recycled"],
    link: "/products/sustainable"
  },
  {
    title: "Tech-Infused Streetwear",
    description: "The fusion of technology and streetwear creates functional, futuristic apparel for the modern wardrobe.",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    tags: ["tech", "innovation", "functional"],
    link: "/products/apparel"
  },
  {
    title: "Retro Revival",
    description: "Classic styles from the 80s and 90s are making a strong comeback with modern updates.",
    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1565&q=80",
    tags: ["vintage", "classic", "nostalgic"],
    link: "/products/retro"
  }
];

const TrendingSection: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (link?: string) => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8 text-center">Trending in Streetwear</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingItems.map((item, index) => (
            <Card 
              key={index} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleCardClick(item.link)}
            >
              <div className="aspect-[4/3] bg-muted">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
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
