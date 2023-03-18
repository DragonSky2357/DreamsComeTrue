import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SignUpDto } from './DTO/signUp.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'User 생성 API', description: 'User 회원 가입' })
  @ApiBody({ type: SignUpDto })
  @ApiCreatedResponse({ description: 'User 회원가입', type: User })
  @Post()
  create(@Body() createUserDto: SignUpDto): Promise<any> {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findUser(id);
  }
}
