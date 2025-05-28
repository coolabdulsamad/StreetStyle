
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Clear the cart after successful payment
      clearCart();
      toast.success('Payment successful! Your order has been placed.');
    }
  }, [sessionId, clearCart]);

  return (
    <PageLayout>
      <div className="container max-w-2xl py-16">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been confirmed and will be processed shortly.
            </p>
            {sessionId && (
              <p className="text-sm text-muted-foreground">
                Session ID: {sessionId}
              </p>
            )}
            <div className="flex gap-4 justify-center mt-6">
              <Button onClick={() => navigate('/profile?tab=orders')}>
                View Orders
              </Button>
              <Button variant="outline" onClick={() => navigate('/products')}>
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default CheckoutSuccessPage;
