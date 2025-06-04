// @/pages/CheckoutPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PageLayout from '@/components/layout/PageLayout';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Import address services and components
import { getAddresses, addAddress, updateAddress, UserAddressRow } from '@/lib/services/addressService';
import AddressForm from '@/components/account/AddressForm';

type CheckoutStep = 'shipping' | 'billing' | 'payment_review';

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const { user, isAuthReady } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const [userAddresses, setUserAddresses] = useState<UserAddressRow[]>([]);
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<string | null>(null);
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<string | null>(null);
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
  const [showShippingAddressForm, setShowShippingAddressForm] = useState(false);
  const [showBillingAddressForm, setShowBillingAddressForm] = useState(false);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'paystack' | 'cod'>('paystack');

  useEffect(() => {
    if (!isAuthReady) return;

    if (!user) {
      toast.error('Please log in to complete your purchase');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [user, navigate, items, isAuthReady]);

  const fetchUserAddresses = useCallback(async () => {
    if (!user?.id) return;
    setIsLoadingAddresses(true);
    const { addresses, error } = await getAddresses(user.id);
    if (error) {
      toast.error(error.message || 'Failed to load addresses.');
      setUserAddresses([]);
    } else {
      setUserAddresses(addresses);
      const defaultAddress = addresses.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedShippingAddressId(defaultAddress.id);
        setSelectedBillingAddressId(defaultAddress.id);
      } else if (addresses.length > 0) {
        setSelectedShippingAddressId(addresses[0].id);
        setSelectedBillingAddressId(addresses[0].id);
      } else {
        setSelectedShippingAddressId(null);
        setSelectedBillingAddressId(null);
      }
    }
    setIsLoadingAddresses(false);
  }, [user?.id]);

  useEffect(() => {
    fetchUserAddresses();
  }, [fetchUserAddresses]);

  const handleSaveAddress = async (
    data: Omit<UserAddressRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
    isEdit: boolean,
    formType: 'shipping' | 'billing'
  ) => {
    if (!user?.id) return false;
    setIsSavingAddress(true);
    let success = false;
    let newAddressId: string | null = null;

    if (isEdit) {
      const addressIdToUpdate = formType === 'shipping' ? selectedShippingAddressId : selectedBillingAddressId;
      if (addressIdToUpdate) {
        success = await updateAddress(addressIdToUpdate, user.id, data);
        newAddressId = addressIdToUpdate;
      }
    } else {
      const { address, error } = await addAddress(user.id, data);
      success = !!address && !error;
      if (address) newAddressId = address.id;
    }

    setIsSavingAddress(false);
    if (success) {
      await fetchUserAddresses();
      if (newAddressId) {
        if (formType === 'shipping') setSelectedShippingAddressId(newAddressId);
        if (formType === 'billing') setSelectedBillingAddressId(newAddressId);
      }
      setShowShippingAddressForm(false);
      setShowBillingAddressForm(false);
    }
    return success;
  };

  const handlePlaceOrder = async () => { // Renamed from handleProceedToPayment
    if (!user) {
      toast.error('Please log in to continue');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!selectedShippingAddressId) {
      toast.error('Please select a shipping address.');
      setCurrentStep('shipping');
      return;
    }
    if (!selectedBillingAddressId && !useShippingAsBilling) {
      toast.error('Please select a billing address.');
      setCurrentStep('billing');
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method.');
      setCurrentStep('payment_review');
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        items,
        shipping_address_id: selectedShippingAddressId,
        billing_address_id: useShippingAsBilling ? selectedShippingAddressId : selectedBillingAddressId,
        payment_method: selectedPaymentMethod,
        user_id: user.id
      };

      // Call the new initiate-paystack-payment function
      const { data, error } = await supabase.functions.invoke('initiate-paystack-payment', {
        body: payload
      });

      if (error) throw error;

      if (selectedPaymentMethod === 'paystack' && data?.url) {
        // Redirect to Paystack for payment
        window.location.href = data.url;
      } else if (selectedPaymentMethod === 'cod' && data?.orderId) {
        // For Cash on Delivery, navigate directly to success page with the actual orderId
        clearCart(); // Clear cart after successful COD order
        navigate('/checkout/success', { state: { orderId: data.orderId, paymentMethod: 'Cash on Delivery' } });
      } else {
        throw new Error('Invalid response from payment initiation or invalid payment method handling.');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to place order.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user || items.length === 0 || isLoadingAddresses) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" /> Loading checkout...
        </div>
      </PageLayout>
    );
  }

  const selectedShippingAddress = userAddresses.find(addr => addr.id === selectedShippingAddressId);
  const selectedBillingAddress = useShippingAsBilling
    ? selectedShippingAddress
    : userAddresses.find(addr => addr.id === selectedBillingAddressId);

  return (
    <PageLayout>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Steps Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step Navigation */}
            <div className="flex justify-between items-center mb-6">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentStep === 'billing') setCurrentStep('shipping');
                  if (currentStep === 'payment_review') setCurrentStep(useShippingAsBilling ? 'shipping' : 'billing');
                }}
                disabled={currentStep === 'shipping'}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <span className="font-semibold text-lg">
                Step {currentStep === 'shipping' ? 1 : currentStep === 'billing' ? 2 : 3} of 3:
                {' '}
                {currentStep === 'shipping' ? 'Shipping Address' : currentStep === 'billing' ? 'Billing Address' : 'Payment & Review'}
              </span>
              <Button
                variant="outline"
                onClick={() => {
                  if (currentStep === 'shipping') {
                    if (!selectedShippingAddressId) {
                      toast.error('Please select a shipping address or add a new one.');
                      return;
                    }
                    setCurrentStep('billing');
                  } else if (currentStep === 'billing') {
                    if (!selectedBillingAddressId && !useShippingAsBilling) {
                      toast.error('Please select a billing address or use shipping address.');
                      return;
                    }
                    setCurrentStep('payment_review');
                  }
                }}
                disabled={currentStep === 'payment_review'}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Step 1: Shipping Address */}
            {currentStep === 'shipping' && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                  <CardDescription>Select or add your shipping address.</CardDescription>
                </CardHeader>
                <CardContent>
                  {showShippingAddressForm ? (
                    <AddressForm
                      onSave={(data) => handleSaveAddress(data, !!(selectedShippingAddressId && userAddresses.some(a => a.id === selectedShippingAddressId)), 'shipping')}
                      onCancel={() => setShowShippingAddressForm(false)}
                      isSaving={isSavingAddress}
                      initialData={selectedShippingAddressId ? userAddresses.find(a => a.id === selectedShippingAddressId) : null}
                    />
                  ) : (
                    <div className="space-y-4">
                      {userAddresses.length > 0 ? (
                        <RadioGroup
                          value={selectedShippingAddressId || ''}
                          onValueChange={setSelectedShippingAddressId}
                          className="space-y-2"
                        >
                          {userAddresses.map((address) => (
                            <Label
                              key={address.id}
                              htmlFor={`shipping-${address.id}`}
                              className="flex flex-col space-y-1 rounded-md border p-4 cursor-pointer hover:bg-muted/50 transition-colors data-[state=checked]:border-primary"
                              data-state={selectedShippingAddressId === address.id ? 'checked' : 'unchecked'}
                            >
                              <RadioGroupItem value={address.id} id={`shipping-${address.id}`} className="sr-only" />
                              <span className="font-semibold">{address.full_name}</span>
                              <span>{address.street_address}</span>
                              <span>{address.city}, {address.state} {address.postal_code}</span>
                              <span>{address.country}</span>
                              {address.phone_number && <p className="text-sm text-muted-foreground">{address.phone_number}</p>}
                              <div className="flex gap-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedShippingAddressId(address.id);
                                    setShowShippingAddressForm(true);
                                  }}
                                >
                                  Edit
                                </Button>
                              </div>
                            </Label>
                          ))}
                        </RadioGroup>
                      ) : (
                        <p className="text-muted-foreground">No addresses found. Please add one.</p>
                      )}
                      <Button
                        onClick={() => {
                          setSelectedShippingAddressId(null);
                          setShowShippingAddressForm(true);
                        }}
                        variant="outline"
                      >
                        Add New Shipping Address
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Billing Address */}
            {currentStep === 'billing' && (
              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                  <CardDescription>Select or add your billing address.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      id="useShippingAsBilling"
                      checked={useShippingAsBilling}
                      onChange={(e) => setUseShippingAsBilling(e.target.checked)}
                      className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <Label htmlFor="useShippingAsBilling">Same as shipping address</Label>
                  </div>

                  {!useShippingAsBilling && (
                    showBillingAddressForm ? (
                      <AddressForm
                        onSave={(data) => handleSaveAddress(data, !!(selectedBillingAddressId && userAddresses.some(a => a.id === selectedBillingAddressId)), 'billing')}
                        onCancel={() => setShowBillingAddressForm(false)}
                        isSaving={isSavingAddress}
                        initialData={selectedBillingAddressId ? userAddresses.find(a => a.id === selectedBillingAddressId) : null}
                      />
                    ) : (
                      <div className="space-y-4">
                        {userAddresses.length > 0 ? (
                          <RadioGroup
                            value={selectedBillingAddressId || ''}
                            onValueChange={setSelectedBillingAddressId}
                            className="space-y-2"
                          >
                            {userAddresses.map((address) => (
                              <Label
                                key={address.id}
                                htmlFor={`billing-${address.id}`}
                                className="flex flex-col space-y-1 rounded-md border p-4 cursor-pointer hover:bg-muted/50 transition-colors data-[state=checked]:border-primary"
                                data-state={selectedBillingAddressId === address.id ? 'checked' : 'unchecked'}
                              >
                                <RadioGroupItem value={address.id} id={`billing-${address.id}`} className="sr-only" />
                                <span className="font-semibold">{address.full_name}</span>
                                <span>{address.street_address}</span>
                                <span>{address.city}, {address.state} {address.postal_code}</span>
                                <span>{address.country}</span>
                                {address.phone_number && <p className="text-sm text-muted-foreground">{address.phone_number}</p>}
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedBillingAddressId(address.id);
                                      setShowBillingAddressForm(true);
                                    }}
                                  >
                                    Edit
                                  </Button>
                                </div>
                              </Label>
                            ))}
                          </RadioGroup>
                        ) : (
                          <p className="text-muted-foreground">No addresses found. Please add one.</p>
                        )}
                        <Button
                          onClick={() => {
                            setSelectedBillingAddressId(null);
                            setShowBillingAddressForm(true);
                          }}
                          variant="outline"
                        >
                          Add New Billing Address
                        </Button>
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment Method & Review */}
            {currentStep === 'payment_review' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Choose how you'd like to pay.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={selectedPaymentMethod}
                      onValueChange={(value: 'paystack' | 'cod') => setSelectedPaymentMethod(value)}
                      className="space-y-4"
                    >
                      <Label htmlFor="paystack-payment" className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer">
                        <RadioGroupItem value="paystack" id="paystack-payment" />
                        <div>
                          <span className="font-medium">Credit/Debit Card (via Paystack)</span>
                          <p className="text-sm text-muted-foreground">Pay securely with your card via Paystack.</p>
                        </div>
                      </Label>
                      <Label htmlFor="cod-payment" className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer">
                        <RadioGroupItem value="cod" id="cod-payment" />
                        <div>
                          <span className="font-medium">Cash on Delivery (COD)</span>
                          <p className="text-sm text-muted-foreground">Pay with cash when your order arrives.</p>
                        </div>
                      </Label>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Order Review</CardTitle>
                    <CardDescription>Confirm your order details before placing.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold mb-2">Items:</h3>
                    <div className="space-y-3 mb-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <img
                            src={item.product.images[0]?.image_url || `https://placehold.co/60x60/cccccc/333333?text=No+Img`}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => { e.currentTarget.src = `https://placehold.co/60x60/cccccc/333333?text=No+Img`; }}
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{item.product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.variant?.name || 'N/A'} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">
                            {formatPrice(item.variant ? item.variant.price * item.quantity : 0)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    <h3 className="font-semibold mb-2">Shipping Address:</h3>
                    {selectedShippingAddress ? (
                      <div className="text-sm text-muted-foreground">
                        <p>{selectedShippingAddress.full_name}</p>
                        <p>{selectedShippingAddress.street_address}</p>
                        <p>{selectedShippingAddress.city}, {selectedShippingAddress.state} {selectedShippingAddress.postal_code}</p>
                        <p>{selectedShippingAddress.country}</p>
                        {selectedShippingAddress.phone_number && <p>{selectedShippingAddress.phone_number}</p>}
                      </div>
                    ) : (
                      <p className="text-sm text-red-500">No shipping address selected.</p>
                    )}

                    <h3 className="font-semibold mt-4 mb-2">Billing Address:</h3>
                    {selectedBillingAddress ? (
                      <div className="text-sm text-muted-foreground">
                        <p>{selectedBillingAddress.full_name}</p>
                        <p>{selectedBillingAddress.street_address}</p>
                        <p>{selectedBillingAddress.city}, {selectedBillingAddress.state} {selectedBillingAddress.postal_code}</p>
                        <p>{selectedBillingAddress.country}</p>
                        {selectedBillingAddress.phone_number && <p>{selectedBillingAddress.phone_number}</p>}
                      </div>
                    ) : (
                      <p className="text-sm text-red-500">No billing address selected.</p>
                    )}

                    <h3 className="font-semibold mt-4 mb-2">Payment Method:</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedPaymentMethod === 'paystack' ? 'Credit/Debit Card (via Paystack)' : 'Cash on Delivery'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Payment Summary (always visible) */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {/* Only show "Place Order" button on the final step */}
                {currentStep === 'payment_review' && (
                  <Button
                    onClick={handlePlaceOrder} // Changed to handlePlaceOrder
                    className="w-full"
                    disabled={isProcessing || !selectedShippingAddressId || (!selectedBillingAddressId && !useShippingAsBilling)}
                    size="lg"
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>
                )}
                {/* Optionally, show a disabled button or message on other steps */}
                {currentStep !== 'payment_review' && (
                  <Button className="w-full" disabled size="lg">
                    Complete Steps to Place Order
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CheckoutPage;
