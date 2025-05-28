
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Clock, RefreshCw } from 'lucide-react';

const ReturnsPage = () => {
  return (
    <PageLayout>
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Returns & Exchanges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Return Policy</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold">30 Days</h3>
                  <p className="text-sm text-muted-foreground">Return window from delivery</p>
                </div>
                <div className="text-center">
                  <Package className="w-12 h-12 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold">Original Condition</h3>
                  <p className="text-sm text-muted-foreground">Items must be unworn with tags</p>
                </div>
                <div className="text-center">
                  <RefreshCw className="w-12 h-12 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold">Free Returns</h3>
                  <p className="text-sm text-muted-foreground">On orders over $100</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                We want you to be completely satisfied with your purchase. If you're not happy with your order, 
                you can return it within 30 days of delivery for a full refund or exchange.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How to Return</h2>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                <li>Log into your account and go to "Order History"</li>
                <li>Find your order and click "Return Items"</li>
                <li>Select the items you want to return and reason</li>
                <li>Print the prepaid return label</li>
                <li>Package items securely and attach the label</li>
                <li>Drop off at any authorized shipping location</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Exchanges</h2>
              <p className="text-muted-foreground mb-4">
                Need a different size or color? We offer free exchanges for the same item in different 
                sizes or colors, subject to availability.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Size exchanges are free within 30 days</li>
                <li>Color exchanges subject to availability</li>
                <li>Limited edition items may not be exchangeable</li>
                <li>Exchanges processed within 3-5 business days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Refund Timeline</h2>
              <p className="text-muted-foreground mb-4">
                Once we receive your return, we'll process it within 2-3 business days. 
                Refunds will be issued to your original payment method:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Credit cards: 3-5 business days</li>
                <li>PayPal: 1-2 business days</li>
                <li>Store credit: Immediately</li>
              </ul>
            </section>

            <div className="flex gap-4">
              <Button>Start a Return</Button>
              <Button variant="outline">Contact Support</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ReturnsPage;
