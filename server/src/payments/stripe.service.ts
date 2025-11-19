import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    this.stripe = new Stripe(key, {
      apiVersion: '2024-11-20.acacia',
    });
    this.logger.log('Stripe service initialized');
  }

  async createCheckoutSession(customerEmail: string, priceId: string) {
    return this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: customerEmail,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/payment/success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    });
  }

  async createCustomer(email: string, name?: string) {
    return this.stripe.customers.create({
      email,
      name,
    });
  }

  async getSubscription(subscriptionId: string) {
    return this.stripe.subscriptions.retrieve(subscriptionId);
  }

  async cancelSubscription(subscriptionId: string) {
    return this.stripe.subscriptions.cancel(subscriptionId);
  }

  async updateSubscription(subscriptionId: string, priceId: string) {
    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
    return this.stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: priceId,
        },
      ],
    });
  }
}
