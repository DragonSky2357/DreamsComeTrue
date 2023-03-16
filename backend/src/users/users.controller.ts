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
import { UsersService } from './users.service';
import { Users } from './entity/Users.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: any): Promise<any> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Users> {
    return this.usersService.findUser(id);
  }
}
