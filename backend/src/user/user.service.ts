import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { hash } from '../common/utils/utils';
import { SignUpDTO } from './DTO/signUp.dto';
import { MailService } from '../mail/mail.service';
import { uploadFileTo } from 'src/common/utils/s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly mailerService: MailService,
  ) {}

  async create(createUser: SignUpDTO): Promise<any> {
    const isExist = await this.userRepository.findOne({
      where: [{ userid: createUser.userid }, { username: createUser.username }],
    });

    if (isExist) {
      let message;

      if (isExist.userid === createUser.userid) {
        message = '이미 존재하는 사용자 ID입니다.';
      } else if (isExist.username === createUser.username) {
        message = '이미 존재하는 사용자 이름입니다.';
      }

      throw new ForbiddenException({
        sucess: false,
        statusCode: HttpStatus.FORBIDDEN,
        message,
        error: 'Forbidden',
      });
    }

    const saveUser = {
      ...createUser,
      password: await hash(createUser.password),
    };

    const { password, ...result } = await this.userRepository.save(saveUser);

    await this.mailerService.sendHello(result.email);
    return { sucess: true, message: 'created user successfully' };
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({});
  }

  async findOne(userid: string): Promise<User | any> {
    const findUser = await this.userRepository.findOneBy({ userid });

    if (!findUser) {
      throw new ForbiddenException({
        sucess: false,
        statusCode: HttpStatus.FORBIDDEN,
        message: '존재 하지 않은 사용자 입니다.',
        error: 'Forbidden',
      });
    }

    return findUser;
  }

  async findUserByName(username: string): Promise<any> {
    const findUser = await this.userRepository.findOneBy({
      username,
    });

    if (!findUser) {
      throw new ForbiddenException({
        sucess: false,
        statusCode: HttpStatus.FORBIDDEN,
        message: '존재 하지 않은 사용자 입니다.',
        error: 'Forbidden',
      });
    }
    const { id, password, ...rest } = findUser;
    return rest;
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

  async findUserByKakao(
    provider: string,
    platformId: string,
    email: string,
  ): Promise<any> {
    const findUser = await this.userRepository.findOne({
      where: {
        platform: provider,
        platformId: platformId,
        email,
      },
    });

    return findUser;
  }
  async findUserByUsername(username: string): Promise<any> {
    const findUser = await this.userRepository.findOne({
      where: { username },
      relations: ['post', 'followers', 'following'],
    });

    console.log(findUser);
    const { id, password, email, userid, updatedAt, ...returnUser } = findUser;

    // returnUser.followers.map((user) => {
    //   delete user.userid,
    //     delete user.password,
    //     delete user.email,
    //     delete user.createdAt,
    //     delete user.updatedAt;
    // });

    // returnUser.following.map((user) => {
    //   delete user.userid,
    //     delete user.password,
    //     delete user.email,
    //     delete user.createdAt,
    //     delete user.updatedAt;
    // });
    return returnUser;
  }

  async editUser(
    username: string,
    editUserInfo: any,
    avatar: Express.Multer.File,
  ): Promise<any> {
    console.log(avatar);
    const findUser = await this.userRepository.findOne({
      where: { username },
    });

    if (!findUser) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['존재 하지 않은 사용자 입니다.'],
        error: 'Forbidden',
      });
    }

    // const existedUser = await this.userRepository.findOne({
    //   where: { username: editUserInfo.username },
    // });

    // if (existedUser) {
    //   return {
    //     sucess: false,
    //     message: '이미 존재하는 이름입니다.',
    //   };
    // }

    let updateUser = { ...editUserInfo };

    if (editUserInfo.password !== undefined) {
      const hashedPassword = await hash(editUserInfo.password);
      updateUser = {
        ...editUserInfo,
        password: hashedPassword,
      };
    }

    if (avatar !== undefined) {
      const uploadReturn = await uploadFileTo(avatar.buffer);

      updateUser['avatar'] = uploadReturn.Location;
    }

    await this.userRepository.merge(findUser, {
      ...updateUser,
    });

    this.userRepository.save(findUser);

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

  async unFollowUser(userId: string) {
    const unFollowingUser = await this.userRepository.findOne({
      where: { userid: userId },
      relations: ['following'],
      select: ['id'],
    });

    // TODO unfollowing work
  }
}
