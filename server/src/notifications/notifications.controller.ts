import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantId } from '../common/decorators/tenant.decorator';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create notification' })
  create(
    @Body() createNotificationDto: CreateNotificationDto,
    @TenantId() tenantId: string,
    @Request() req,
  ) {
    return this.notificationsService.create(tenantId, createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  findAll(
    @Request() req,
    @TenantId() tenantId: string,
    @Query('unread') unread?: string,
  ) {
    return this.notificationsService.findAllForUser(
      req.user.userId,
      tenantId,
      unread === 'true',
    );
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notifications count' })
  getUnreadCount(@Request() req, @TenantId() tenantId: string) {
    return this.notificationsService.getUnreadCount(req.user.userId, tenantId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(
    @Param('id') id: string,
    @Request() req,
    @TenantId() tenantId: string,
  ) {
    return this.notificationsService.markAsRead(id, req.user.userId, tenantId);
  }

  @Patch('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@Request() req, @TenantId() tenantId: string) {
    return this.notificationsService.markAllAsRead(req.user.userId, tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  remove(@Param('id') id: string, @Request() req, @TenantId() tenantId: string) {
    return this.notificationsService.remove(id, req.user.userId, tenantId);
  }
}
