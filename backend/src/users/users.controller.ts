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
import { JoinRequestDto } from './DTO/join.request.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers(@Req() req) {
    return req.user;
  }

  @Post()
  createUser(@Body() data: JoinRequestDto) {
    return null;
  }

  @Post('login')
  login(@Req() req) {
    return req.user;
  }

  @Post('logout')
  logout(@Req() req, @Res() res) {
    req.logOut();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok');
  }

  @Get('friends/:id')
  getFriendById(@Param() param) {
    console.log(param.id);
  }

  @Get('friends')
  getAllFriends(@Query() query) {
    console.log(query.perPage, query.page);
  }
}
