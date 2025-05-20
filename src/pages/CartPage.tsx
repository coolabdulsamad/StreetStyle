
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { Trash2 } from 'lucide-react';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();

  return (
    <PageLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button asChild>
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex flex-col sm:flex-row gap-4 p-4 border rounded-md"
                  >
                    {/* Product Image */}
                    <div className="w-full sm:w-40 aspect-square">
                      <Link to={`/product/${item.product.slug}`}>
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </Link>
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-grow">
                      <Link to={`/product/${item.product.slug}`}>
                        <h3 className="font-medium text-lg">{item.product.name}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.variant.name}
                      </p>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <Input
                            className="w-12 h-8 text-center mx-1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="text-right font-medium sm:w-24">
                      ${(item.variant.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                <Button asChild>
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-gray-50 p-6 rounded-md">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t my-4 pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button className="w-full mt-4" asChild>
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
                
                <div className="mt-6 text-sm text-muted-foreground text-center">
                  <p>We accept</p>
                  <div className="flex justify-center gap-2 mt-2">
                    {/* Payment icons would go here */}
                    <span className="px-2 py-1 border rounded text-xs">Visa</span>
                    <span className="px-2 py-1 border rounded text-xs">Mastercard</span>
                    <span className="px-2 py-1 border rounded text-xs">PayPal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CartPage;
