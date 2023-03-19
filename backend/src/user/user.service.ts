import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { hash } from '../common/utils/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUser: any): Promise<any> {
    const isExist = await this.userRepository.findOneBy({
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

    const { password, ...result } = await this.userRepository.save(saveUser);

    return result;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({});
  }

  async findOne(userid: string): Promise<User | any> {
    const findUser = await this.userRepository.findOneBy({ userid });

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
