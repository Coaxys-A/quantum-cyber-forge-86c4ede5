import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantId } from '../common/decorators/tenant.decorator';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@ApiTags('subscriptions')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create subscription' })
  create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @TenantId() tenantId: string,
    @Request() req,
  ) {
    return this.subscriptionsService.create(
      tenantId,
      req.user.userId,
      createSubscriptionDto,
    );
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current tenant subscription' })
  findCurrent(@TenantId() tenantId: string) {
    return this.subscriptionsService.findByTenant(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subscription by ID' })
  findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.subscriptionsService.findOne(id, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update subscription' })
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
    @TenantId() tenantId: string,
  ) {
    return this.subscriptionsService.update(id, tenantId, updateSubscriptionDto);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel subscription' })
  cancel(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.subscriptionsService.cancel(id, tenantId);
  }
}
