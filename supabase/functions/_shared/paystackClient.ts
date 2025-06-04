// supabase/functions/_shared/paystackClient.ts

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string; // e.g., 'success', 'failed'
    reference: string;
    amount: number; // in kobo
    currency: string;
    gateway_response: string;
    // ... other fields
  };
}

export class PaystackClient {
  private secretKey: string;
  private baseUrl: string = 'https://api.paystack.co';

  constructor(secretKey: string) {
    if (!secretKey) {
      throw new Error('Paystack Secret Key is required.');
    }
    this.secretKey = secretKey;
  }

  /**
   * Initializes a new Paystack transaction.
   * @param params - { email: string, amount: number (in kobo), reference: string, callback_url: string, metadata?: object }
   * @returns Promise<PaystackInitializeResponse>
   */
  async initializePayment(params: {
    email: string;
    amount: number; // in kobo
    reference: string;
    callback_url: string;
    metadata?: object;
  }): Promise<PaystackInitializeResponse> {
    const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: params.email,
        amount: params.amount,
        currency: 'NGN', // Assuming NGN as per our previous discussion
        reference: params.reference,
        callback_url: params.callback_url,
        metadata: params.metadata,
      }),
    });

    const data = await response.json();
    return data;
  }

  /**
   * Verifies the status of a Paystack transaction.
   * @param reference - The transaction reference (your order ID).
   * @returns Promise<PaystackVerifyResponse>
   */
  async verifyPayment(reference: string): Promise<PaystackVerifyResponse> {
    const response = await fetch(`${this.baseUrl}/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  }
}
