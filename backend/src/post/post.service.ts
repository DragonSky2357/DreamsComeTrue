import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { JsonContains, Repository } from 'typeorm';
import { OpenAIClient } from '@platohq/nestjs-openai';
import Translator from 'papago';
import { User } from '../user/entity/user.entity';
import { HttpService } from '@nestjs/axios';
import fs from 'fs';
import Aws, { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly openAIClient: OpenAIClient,
  ) {}

  async createPost(username: string, createPost: any): Promise<any> {
    try {
      const findUser = await this.userRepository.findOne({
        where: { username },
        relations: ['post'],
      });

      const newPost = {
        title: createPost.title,
        bodyText: createPost.bodyText,
        imageUrl: createPost.imageUrl,
        rating: createPost.rating,
        writer: findUser,
      };

      const savePost = await this.postRepository.save(newPost);

      await findUser.post.push(savePost);

      return {
        sucess: true,
        message: 'create post success',
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

      const createImageURL: string = response.data.data[0].url;
      const resultImageURL = await this.uploadImage(createImageURL);

      return {
        sucess: true,
        imageUrl: resultImageURL,
      };
    } catch (e) {
      return {
        sucess: false,
        message: e.message,
      };
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
    const uploadBucketResult = await this.uploadFileTo(imageURL);

    return uploadBucketResult.Location;
  }

  async downloadImage(createImageURL: string) {
    const response = await this.httpService.axiosRef({
      url: createImageURL,
      method: 'GET',
      responseType: 'arraybuffer',
    });

    return response.data;
  }

  async uploadFileTo(file: any) {
    const s3 = new Aws.S3({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    try {
      return await s3
        .upload({
          Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
          Key: `${uuidv4()}.png`,
          Body: file,
          ContentType: 'Content-Type: image/png',
        })
        .promise();
    } catch (err) {
      console.error(err);
    }
  }
  async getAllPost(): Promise<any> {
    return this.postRepository.find({ relations: ['comment'] });
  }

  async getPostById(postId: number): Promise<any> {
    const findPost = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['writer', 'comment', 'comment.writer'],
    });

    const { writer, comment, ...rest } = findPost;

    comment.map((c) => {
      delete c.writer.password;
      delete c.writer.post;
      delete c.writer.userid;
      delete c.writer.email;
      delete c.writer.updatedAt;
      delete c.writer.id;
    });

    const resultPost = {
      ...rest,
      writer: {
        username: writer.username,
      },
      comment,
    };
    return resultPost;
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

  async updateLikeCount(username: string, postId: number): Promise<any> {
    const findUser = await this.userRepository.findOne({
      where: { username },
      relations: ['likePost'],
      select: ['id'],
    });

    if (!findUser) {
      return new Error('존재하지 않은 유저입니다.');
    }

    const findPost = await this.postRepository.findOne({
      where: { id: postId },
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
}
