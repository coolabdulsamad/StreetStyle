
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { ProductReview } from '@/types/product';

interface ProductReviewsProps {
  reviews: ProductReview[];
  onAddReview: (review: Omit<ProductReview, 'id' | 'created_at' | 'updated_at'>) => void;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews, onAddReview }) => {
  const [newReview, setNewReview] = useState({ rating: 5, review_text: '' });
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReview({
      product_id: '', // This will be set by the parent component
      user_id: '', // This will be set by the parent component
      userName: 'Current User',
      rating: newReview.rating,
      review_text: newReview.review_text,
      verified_purchase: false,
      helpful_votes: 0,
      images: null,
    });
    setNewReview({ rating: 5, review_text: '' });
    setShowForm(false);
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer' : ''}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Customer Reviews</h3>
        <Button onClick={() => setShowForm(!showForm)}>Write a Review</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                {renderStars(newReview.rating, true, (rating) => 
                  setNewReview(prev => ({ ...prev, rating }))
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Review</label>
                <Textarea
                  value={newReview.review_text}
                  onChange={(e) => setNewReview(prev => ({ ...prev, review_text: e.target.value }))}
                  placeholder="Share your experience with this product..."
                  rows={4}
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Submit Review</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium">{review.userName || 'Anonymous'}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              <p className="text-gray-700">{review.review_text}</p>
              {review.verified_purchase && (
                <div className="mt-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Verified Purchase
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
