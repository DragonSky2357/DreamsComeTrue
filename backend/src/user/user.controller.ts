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
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAccessGuard } from './../auth/jwt-access.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(JwtAccessGuard)
  findAll(@Query('count') count = 0): Promise<User[]> {
    return this.userService.findCountUser(count);
  }

  @Get('/profile')
  @UseGuards(JwtAccessGuard)
  getProfile(@Req() req) {
    return this.userService.getProfile(req.user.id);
  }

  @Get('/profile/edit')
  @UseGuards(JwtAccessGuard)
  getUserProfile(@Req() req) {
    return this.userService.getEditProfile(req.user.id);
  }

  @Patch('/profile/edit')
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
  unfollowUser(
    @Req() request,
    @Param('username') username: string,
  ): Promise<any> {
    return this.userService.unFollowUser(request.user.userid);
  }
}
