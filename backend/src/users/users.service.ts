import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entity/Users.entity';
import { hash } from '../utils/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async create(createUser: any): Promise<any> {
    const isExist = await this.usersRepository.findOneBy({
      userid: createUser.userid,
    });

    if (isExist) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: [`이미 등록된 사용자 입니다.`],
        error: 'Forbidden',
      });
    }

    const saveUser = {
      ...createUser,
      password: await hash(createUser.password),
    };

    const { password, ...result } = await this.usersRepository.save(saveUser);

    return result;
  }

  async findAll(): Promise<Users[]> {
    return this.usersRepository.find({});
  }

  async findOne(userid: string): Promise<Users | any> {
    const findUser = await this.usersRepository.findOneBy({ userid });

    if (!findUser) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['존재 하지 않은 사용자 입니다.'],
        error: 'Forbidden',
      });
    }

    return findUser;
  }

  async findUser(userid: string): Promise<any> {
    const findUser = await this.findOne(userid);

    const { password, ...result } = findUser;

    return result;
  }
}
