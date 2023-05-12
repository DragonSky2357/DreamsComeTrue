import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SignUpDTO, SignUpFailedDto, SignUpSuccessDto } from './DTO/signUp.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Create User API', description: 'User SingUp' })
  @ApiBody({ type: SignUpDTO })
  @ApiCreatedResponse({
    description: 'The user was created successfully.',
    type: SignUpSuccessDto,
  })
  @ApiBadRequestResponse({
    description: 'User creation failed.',
    type: SignUpFailedDto,
  })
  @Post('/signup')
  create(@Body() createUserDTO: SignUpDTO): Promise<any> {
    return this.userService.create(createUserDTO);
  }

  @ApiOperation({
    summary: 'User All Get API',
    description: 'User All Get API ',
  })
  @ApiBody({ type: SignUpDTO })
  @ApiCreatedResponse({ description: 'User 회원가입', type: User })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() request: any) {
    return this.userService.findUserByName(request.user.username);
  }

  @Get('/u/:username')
  @UseInterceptors(ClassSerializerInterceptor)
  findUserByUsername(@Param('username') username: string): Promise<User> {
    return this.userService.findUserByUsername(username);
  }

  @Get('/login-user')
  @UseGuards(JwtAuthGuard)
  getFindLoginUser(@Request() request: any): Promise<User> {
    return this.userService.getFindLoginUser(request.user.userid);
  }

  @Patch('/edit')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  editUser(
    @Request() request,
    @Body() editUserInfo: any,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<any> {
    return this.userService.editUser(
      request.user.username,
      editUserInfo,
      avatar,
    );
  }

  @Patch('/u/:username/follow')
  @UseGuards(JwtAuthGuard)
  followUser(
    @Request() request,
    @Param('username') username: string,
  ): Promise<any> {
    return this.userService.followUser(request.user.userid, username);
  }

  @Patch('/u/:username/unfollow')
  @UseGuards(JwtAuthGuard)
  unfollowUser(
    @Request() request,
    @Param('username') username: string,
  ): Promise<any> {
    return this.userService.unFollowUser(request.user.userid);
  }
}
