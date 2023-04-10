import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Request,
  Res,
  UseGuards,
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
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/u/:username')
  findUserByUsername(@Param('username') username: string): Promise<User> {
    return this.userService.findUserByUsername(username);
  }

  @Get('/login-user')
  @UseGuards(JwtAuthGuard)
  getFindLoginUser(@Request() request): Promise<User> {
    const userId = request.user.userid;
    return this.userService.getFindLoginUser(userId);
  }

  @Get('/edit')
  @UseGuards(JwtAuthGuard)
  editUser(@Request() request, @Body() editUserInfo: any): Promise<User> {
    const userId = request.user.userid;
    return this.userService.editUser(userId, editUserInfo);
  }
}
