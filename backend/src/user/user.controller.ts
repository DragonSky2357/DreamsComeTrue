import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { JwtAccessGuard } from '../auth/jwt/jwt-access.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtAccessGuard)
  findAll(@Query('count') count = 0): Promise<User[]> {
    return this.userService.findCountUser(count);
  }

  @Get('/profile/:username')
  @UseGuards(JwtAccessGuard)
  getProfileByUsername(@Req() req, @Param('username') username: string) {
    return this.userService.getProfileByUsername(req.user.id, username);
  }

  @Get('/profile')
  @UseGuards(JwtAccessGuard)
  getProfileById(@Req() req) {
    return this.userService.getProfileByUserId(req.user.id);
  }

  @Patch('/profile')
  @UseGuards(JwtAccessGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  editUser(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<any> {
    return this.userService.editUser(req.user.id, updateUserDto, avatar);
  }

  @Patch('/u/:username/follow')
  @UseGuards(JwtAccessGuard)
  followUser(@Req() req, @Param('username') username: string): Promise<any> {
    return this.userService.followUser(req.user.username, username);
  }

  @Patch('/u/:username/unfollow')
  @UseGuards(JwtAccessGuard)
  unfollowUser(@Req() request): Promise<any> {
    return this.userService.unFollowUser(request.user.userid);
  }
}
