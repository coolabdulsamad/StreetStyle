
import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ProductReview } from '@/types/product';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface ProductReviewsProps {
  reviews: ProductReview[];
  productId: string;
  onAddReview?: (review: ProductReview) => void;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews, productId, onAddReview }) => {
  const { user, profile } = useAuth();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to add a review');
      return;
    }
    
    if (comment.length < 5) {
      toast.error('Please write a more detailed review');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send data to the server
      const newReview: ProductReview = {
        id: Math.random().toString(36).substring(2, 15),
        userId: user.id,
        userName: profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : user.email?.split('@')[0] || 'Anonymous',
        rating,
        comment,
        date: new Date().toISOString(),
      };
      
      // Here you would typically save this to your backend
      if (onAddReview) {
        onAddReview(newReview);
      }
      
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      
      {reviews && reviews.length > 0 ? (
        <div className="space-y-6 mb-8">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>{getInitials(review.userName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{review.userName}</h4>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(review.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={i < review.rating ? "currentColor" : "none"}
                          stroke={i < review.rating ? "none" : "currentColor"}
                          className={`w-4 h-4 ${
                            i < review.rating ? "text-yellow-500" : "text-gray-300"
                          }`}
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground mb-8">No reviews yet. Be the first to review this product!</p>
      )}
      
      <Separator className="my-8" />
      
      <div>
        <h3 className="text-xl font-medium mb-4">Write a Review</h3>
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Rating</label>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    className="focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={i < rating ? "currentColor" : "none"}
                      stroke={i < rating ? "none" : "currentColor"}
                      className={`w-8 h-8 ${
                        i < rating ? "text-yellow-500" : "text-gray-300"
                      } transition-colors hover:text-yellow-400`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="comment" className="block mb-2 font-medium">
                Your Review
              </label>
              <Textarea
                id="comment"
                placeholder="Share your thoughts about this product..."
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        ) : (
          <div className="bg-muted p-4 rounded-md">
            <p>Please sign in to leave a review.</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => {
                window.location.href = '/login';
              }}
            >
              Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
