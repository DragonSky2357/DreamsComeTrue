import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { hash } from '../common/utils/utils';
import { SignUpDTO } from './DTO/signUp.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUser: SignUpDTO): Promise<any> {
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

    return { sucess: true };
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

  async getFindLoginUser(userid: string): Promise<User | any> {
    const findUser = await this.userRepository.findOneBy({ userid });

    if (!findUser) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['존재 하지 않은 사용자 입니다.'],
        error: 'Forbidden',
      });
    }

    const { username, createdAt } = findUser;
    return username;
  }

  async findUser(userid: string): Promise<any> {
    const findUser = await this.userRepository.findOne({
      where: { userid },
    });

    const { password, ...result } = findUser;

    return result;
  }

  async findUserByUsername(username: string): Promise<any> {
    const findUser = await this.userRepository.findOne({
      where: { username },
      relations: ['post', 'followers', 'following'],
    });

    const { id, password, email, userid, updatedAt, ...returnUser } = findUser;

    return returnUser;
  }

  async editUser(userId: string, editUserInfo: any): Promise<any> {
    const findUser = await this.userRepository.findOne({
      where: { userid: userId },
    });

    if (!findUser) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['존재 하지 않은 사용자 입니다.'],
        error: 'Forbidden',
      });
    }

    let updateUser = {};

    if (editUserInfo.password !== undefined) {
      const hashedPassword = await hash(editUserInfo.password);
      updateUser = {
        ...editUserInfo,
        password: hashedPassword,
      };
    }

    const editUser = await this.userRepository.update(findUser.id, {
      ...updateUser,
    });

    return {
      sucess: true,
      message: 'user update successfully',
    };
  }

  async followUser(userId: string, username: string): Promise<any> {
    const followingUser = await this.userRepository.findOne({
      where: { userid: userId },
      relations: ['following'],
      select: ['id'],
    });

    console.log(followingUser);

    if (!followingUser) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['존재 하지 않은 사용자 입니다.'],
        error: 'Forbidden',
      });
    }

    const followerUser = await this.userRepository.findOne({
      where: { username },
      relations: ['followers'],
      select: ['id'],
    });
    console.log(followerUser);

    followingUser.following.push(followerUser);
    followerUser.followers.push(followingUser);

    await this.userRepository.save(followingUser);
    await this.userRepository.save(followerUser);

    return {
      sucess: true,
      message: 'following successfully',
    };
  }
}
