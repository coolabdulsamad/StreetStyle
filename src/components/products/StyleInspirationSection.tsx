
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StyleInspirationSection: React.FC = () => {
  return (
    <div className="my-16">
      <h2 className="text-2xl font-bold mb-6 text-center">Style Inspiration</h2>
      
      <Tabs defaultValue="casual">
        <div className="flex justify-center mb-6">
          <TabsList>
            <TabsTrigger value="casual">Casual</TabsTrigger>
            <TabsTrigger value="streetwear">Streetwear</TabsTrigger>
            <TabsTrigger value="athletic">Athletic</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="casual" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-md mb-4"></div>
                <h3 className="font-medium text-lg">Weekend Comfort</h3>
                <p className="text-sm text-muted-foreground">
                  Pair low-top sneakers with slim jeans and a graphic tee for an effortless weekend look.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-md mb-4"></div>
                <h3 className="font-medium text-lg">Smart Casual</h3>
                <p className="text-sm text-muted-foreground">
                  Elevate your minimal sneakers with chinos and an oxford shirt for a smart-casual vibe.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-md mb-4"></div>
                <h3 className="font-medium text-lg">Laid-Back Cool</h3>
                <p className="text-sm text-muted-foreground">
                  Rock high-tops with cuffed jeans and a hoodie for that perfect laid-back aesthetic.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="streetwear" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-md mb-4"></div>
                <h3 className="font-medium text-lg">Urban Edge</h3>
                <p className="text-sm text-muted-foreground">
                  Layer oversized tees with cargo pants and chunky sneakers for maximum street cred.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-md mb-4"></div>
                <h3 className="font-medium text-lg">Hype Beast</h3>
                <p className="text-sm text-muted-foreground">
                  Mix designer pieces with vintage finds and statement sneakers for an authentic streetwear look.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-md mb-4"></div>
                <h3 className="font-medium text-lg">Monochrome Maven</h3>
                <p className="text-sm text-muted-foreground">
                  Create a cohesive look with tonal colors and let your sneakers be the standout piece.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="athletic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-md mb-4"></div>
                <h3 className="font-medium text-lg">Performance Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Pair technical sneakers with moisture-wicking apparel for maximum performance.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-md mb-4"></div>
                <h3 className="font-medium text-lg">Athleisure</h3>
                <p className="text-sm text-muted-foreground">
                  Blend athletic and leisure wear with premium joggers and fashion-forward sneakers.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-md mb-4"></div>
                <h3 className="font-medium text-lg">Gym to Street</h3>
                <p className="text-sm text-muted-foreground">
                  Create versatile looks that transition seamlessly from workout to casual outings.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StyleInspirationSection;
