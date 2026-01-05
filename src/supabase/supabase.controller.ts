import { Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { UserRole } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Upload files')
@ApiBearerAuth()
@Controller('supabase')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) { }

  @Get('defaults')
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  getDefaultImages() {
    return this.supabaseService.getDefaultImages();
  }

  @Post('upload')
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.supabaseService.uploadFile(file);
  }
}
