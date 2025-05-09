import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { users } from '@prisma/client';
import { Request } from 'express';
import { AuthGuard, RolesGuard } from './middlewares/auth.guard';
import { Roles } from './decorators';

@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  create(@Body() body: Partial<users>) {
    return this.userService.create(body);
  }

  @Post('login')
  login(@Body() body: Partial<users>) {
    return this.userService.login(body);
  }

  @Get('profile')
  profile(@Req() req: Request) {
    const userId = req.user?.id!;
    return this.userService.profile(userId);
  }

  @Put('profile')
  updateProfile(@Req() req: Request, @Body() body: Partial<users>) {
    const userId = req.user?.id!;
    return this.userService.updateProfile(userId, body);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Req() req: Request) {
    const userId = req.params.id;
    return this.userService.getUserById(+userId);
  }

  @Put(':id')
  @Roles('admin')
  update(@Req() req: Request, @Body() body: Partial<users>) {
    const { id } = req.params;
    return this.userService.updateProfile(+id as number, body);
  }
}
