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
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SignUpDto, SignUpFailedDto, SignUpSuccessDto } from './DTO/signUp.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Create User API', description: 'User SingUp' })
  @ApiBody({ type: SignUpDto })
  @ApiCreatedResponse({
    description: 'The user was created successfully.',
    type: SignUpSuccessDto,
  })
  @ApiBadRequestResponse({
    description: 'User creation failed.',
    type: SignUpFailedDto,
  })
  @Post()
  create(@Body() createUserDto: any): Promise<any> {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'User All Get API',
    description: 'User All Get API ',
  })
  @ApiBody({ type: SignUpDto })
  @ApiCreatedResponse({ description: 'User 회원가입', type: User })
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findUser(id);
  }
}
