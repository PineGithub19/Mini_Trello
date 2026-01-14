import { Body, Controller, Patch, Post, Get, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { NotificationResponse } from './response/notification.response';
import { JwtPayload } from 'src/auth/types/jwt-payload';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { UserRole } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Post()
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  async createNotification(@Body() notificationData: CreateNotificationDto, @CurrentUser() user: JwtPayload): Promise<NotificationResponse> {
    return this.notificationService.createNotification(notificationData, user.sub);
  }

  @Get('')
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  async getNotificationsByUserId(@CurrentUser() user: JwtPayload): Promise<NotificationResponse[]> {
    return this.notificationService.getNotificationsByUserId(user.sub);
  }

  @Patch('mark-as-read')
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  async markNotificationAsRead(@Body() notificationId: string): Promise<NotificationResponse> {
    return this.notificationService.markNotificationAsRead(notificationId);
  }

  @Patch('mark-all-as-read')
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  async markAllNotificationsAsRead(@CurrentUser() user: JwtPayload): Promise<NotificationResponse[]> {
    return this.notificationService.markAllNotificationsAsRead(user.sub);
  }
}
