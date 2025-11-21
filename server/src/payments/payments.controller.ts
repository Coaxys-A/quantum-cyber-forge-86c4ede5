import { Controller, Get, Post, Body, UseGuards, Request, RawBodyRequest, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantId } from '../common/decorators/tenant.decorator';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get('plans')
  getPlans() {
    return this.paymentsService.getPlans();
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createCheckout(
    @Request() req,
    @TenantId() tenantId: string,
    @Body() body: { planId: string },
  ) {
    return this.paymentsService.createCheckoutSession(
      req.user.userId,
      tenantId,
      body.planId,
    );
  }

  @Post('usdt/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createUSDTPayment(
    @Request() req,
    @TenantId() tenantId: string,
    @Body() body: { planId: string },
  ) {
    return this.paymentsService.createUSDTPayment(
      req.user.userId,
      tenantId,
      body.planId,
    );
  }

  @Post('usdt/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  verifyUSDTPayment(@Body() body: { paymentId: string; txHash: string }) {
    return this.paymentsService.verifyUSDTPayment(body.paymentId, body.txHash);
  }

  @Get('subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getSubscription(@Request() req, @TenantId() tenantId: string) {
    return this.paymentsService.getUserSubscription(req.user.userId, tenantId);
  }

  @Post('webhook/stripe')
  async handleStripeWebhook(@Req() req: RawBodyRequest<Request>) {
    return this.paymentsService.handleStripeWebhook(req.body);
  }
}
