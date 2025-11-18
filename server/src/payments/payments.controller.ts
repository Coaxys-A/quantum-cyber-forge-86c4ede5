import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get('plans')
  getPlans() {
    return this.paymentsService.getPlans();
  }

  @Post('checkout')
  createCheckout(@Request() req, @Body() body: { planId: string }) {
    return this.paymentsService.createCheckoutSession(req.user.userId, body.planId);
  }

  @Get('subscription')
  getSubscription(@Request() req) {
    return this.paymentsService.getUserSubscription(req.user.userId);
  }
}
