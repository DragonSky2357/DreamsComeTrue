import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { hash, uploadFile } from '../common/utils/utils';
import { SignUpDto } from '../auth/dto/signUp.dto';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async findCountUser(count: number): Promise<User[]> {
    return this.userRepository.find({
      take: count,
    });
  }

  async getProfile(userId: number): Promise<User> {
    console.log(userId);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['post'],
    });

    if (!user) {
      throw new HttpException('exit', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async getUserProfile(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['post'],
    });

    if (!user) {
      throw new HttpException('exit', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async createUser(signUpDto: SignUpDto): Promise<any> {
    const newUser = new User({
      ...signUpDto,
      password: await hash(signUpDto.password),
    });

    //await this.mailerService.sendHello(result.email);
    return await this.userRepository.save(newUser);
  }

  async editUser(
    userId: number,
    editUser: UpdateUserDto,
    avatar: Express.Multer.File,
  ): Promise<any> {
    const imageUrl = await uploadFile(avatar.buffer, 'avatar');

    try {
      await await this.userRepository.update(userId, {
        ...editUser,
        avatar: imageUrl.Key.split('/').reverse()[0],
      });
    } catch (e) {
      console.log(e);
    }
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    return user;
  }
  async findUserByName(username: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentRefreshToken = await this.getCurrentHashedRefreshToken(
      refreshToken,
    );
    const currentRefreshTokenExp = await this.getCurrentRefreshTokenExp();

    await this.userRepository.update(userId, {
      currentRefreshToken: currentRefreshToken,
      currentRefreshTokenExp: currentRefreshTokenExp,
    });
  }

  async getCurrentHashedRefreshToken(refreshToken: string) {
    const saltOrRounds = 10;
    const currentRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);
    return currentRefreshToken;
  }

  async getCurrentRefreshTokenExp(): Promise<Date> {
    const currentDate = new Date();
    const currentRefreshTokenExp = new Date(
      currentDate.getTime() +
        parseInt(
          this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE_TIME'),
        ),
    );

    return currentRefreshTokenExp;
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: number,
  ): Promise<User> {
    const user: User = await this.findUserById(userId);

    if (!user.currentRefreshToken) {
      return null;
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }
  async removeRefreshToken(userId: number): Promise<any> {
    return await this.userRepository.update(userId, {
      currentRefreshToken: null,
      currentRefreshTokenExp: null,
    });
  }

  async getFindLoginUser(email: string): Promise<User | any> {
    const findUser = await this.userRepository.findOneBy({ email });

    if (!findUser) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['존재 하지 않은 사용자 입니다.'],
        error: 'Forbidden',
      });
    }

    const { username, created_at } = findUser;
    return username;
  }

  async findUser(email: string): Promise<any> {
    const findUser = await this.userRepository.findOne({
      where: { email },
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
  async findUserByUserUsername(username: string): Promise<any> {
    const findUser = await this.userRepository.findOne({
      where: { username },
      relations: ['post'],
    });

    console.log(findUser);
    const { id, password, email, updated_at, ...returnUser } = findUser;

    return returnUser;
  }

  async followUser(email: string, username: string): Promise<any> {
    const followingUser = await this.userRepository.findOne({
      where: { email },
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

    await this.userRepository.save(followingUser);
    await this.userRepository.save(followerUser);

    return {
      sucess: true,
      message: 'following successfully',
    };
  }

  async unFollowUser(email: string) {
    const unFollowingUser = await this.userRepository.findOne({
      where: { email },
      relations: ['following'],
      select: ['id'],
    });

    // TODO unfollowing work
  }
}
