import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { JsonContains, Repository } from 'typeorm';
import { OpenAIClient } from '@platohq/nestjs-openai';
import Translator from 'papago';
import { User } from '../user/entity/user.entity';
import { HttpService } from '@nestjs/axios';
import fs from 'fs';

import { ConfigService } from '@nestjs/config';

import { uploadFile } from './../common/utils/utils';
import { CreatePostDto } from './dto/create-post.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,

    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly openAIClient: OpenAIClient,
  ) {}

  async getAllPost(): Promise<any> {
    return await this.postRepository
      .createQueryBuilder('post')
      .select(['post.id', 'post.title', 'post.image'])
      .addSelect(['writer.id', 'writer.username'])
      .leftJoin('post.writer', 'writer')
      .orderBy('RAND()')
      .getMany();
  }

  async createPost(id: number, createPostDto: CreatePostDto): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['post'],
      });

      const newPost = new Post({
        ...createPostDto,
        image: createPostDto.image.split('/').reverse()[0],
      });

      const savePost = await this.postRepository.save(newPost);

      user.post.push(savePost);

      await this.userRepository.save(user);

      return {
        sucess: true,
      };
    } catch (e) {
      return {
        sucess: false,
        message: e.message,
      };
    }
  }

  async createImage(title: string): Promise<any> {
    try {
      const translateText = String(
        await this.translateWithPapago(title),
      ).concat(', digital art');

      const response = await this.openAIClient.createImage({
        prompt: translateText,
        n: 1,
        size: '1024x1024',
      });

      const createImageUrl: string = response.data.data[0].url;
      const resultImageUrl = await this.uploadImage(createImageUrl);

      console.log(resultImageUrl);
      return {
        image: resultImageUrl,
      };
    } catch (e) {
      return e;
    }
  }

  async translateWithPapago(text: string): Promise<string> {
    const translator = new Translator(
      process.env.PAPAGO_ID,
      process.env.PAPAGO_SECRET,
    );
    const result = await translator.translate(text, 'ko', 'en');

    return result.text;
  }

  async uploadImage(createImageURL): Promise<any> {
    const imageURL = await this.downloadImage(createImageURL);
    const uploadBucketResult = await uploadFile(imageURL, 'image');

    return uploadBucketResult.Key;
  }

  async downloadImage(createImageURL: string) {
    const response = await this.httpService.axiosRef({
      url: createImageURL,
      method: 'GET',
      responseType: 'arraybuffer',
    });

    return response.data;
  }

  async getPostById(id: string): Promise<any> {
    const findPost = await this.postRepository.findOne({
      where: { id },
      relations: ['writer'],
      select: {
        id: true,
        title: true,
        describe: true,
        image: true,
        writer: {
          username: true,
          avatar: true,
        },
      },
    });

    return findPost;
  }

  async searchPost(title: string, content: string): Promise<any> {
    const findPost = await this.postRepository
      .createQueryBuilder('post')
      .where('post.title like :title', { title: `%${title}%` })
      .orWhere('post.bodyText like :content', { content: `%${content}%` })
      .getMany();

    return findPost;
  }

  async getUserPost(username: string): Promise<any> {
    const findPost = await this.userRepository.findOne({
      where: { username },
      relations: ['post'],
    });

    return findPost.post;
  }

  async updateLikeCount(username: string, id: string): Promise<any> {
    const findUser = await this.userRepository.findOne({
      where: { username },
      relations: ['likePost'],
      select: ['id'],
    });

    if (!findUser) {
      return new Error('존재하지 않은 유저입니다.');
    }

    const findPost = await this.postRepository.findOne({
      where: { id },
      relations: ['likeUser'],
      select: ['id'],
    });

    if (!findPost) {
      return new Error('존재하지 않은 포스터입니다.');
    }

    console.log(findUser);
    console.log(findPost);
    findUser.likePost.push(findPost);
    findPost.likeUser.push(findUser);

    await this.userRepository.save(findUser);
    await this.postRepository.save(findPost);

    return {
      sucess: 'true',
      message: 'success star',
    };
  }

  async getRandomImage(count: number): Promise<{ image: string[] }> {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .select('post.image')
      .orderBy('RAND()')
      .limit(count)
      .getMany();

    const image = [];
    post.map((item) => {
      image.push(item.image);
    });

    return { image };
  }
}
