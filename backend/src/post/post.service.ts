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
import uuid from 'uuid';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly openAIClient: OpenAIClient,
  ) {}

  async create(userid: string, createPost: any): Promise<any> {
    const findUser = await this.userRepository.findOne({
      where: { userid },
      relations: ['posts'],
    });

    const translateText = String(
      await this.translateWithPapago(createPost.title),
    ).concat(', digital art');

    const response = await this.openAIClient.createImage({
      prompt: translateText,
      n: 1,
      size: '1024x1024',
    });

    const createImageURL: string = response.data.data[0].url;

    await this.downloadImage(createImageURL);

    const savePost = {
      title: createPost.title,
      bodyText: createPost.bodyText,
      imageUrl: createImageURL,
      writer: findUser,
    };

    const newPost = await this.postRepository.save(savePost);

    await findUser.posts.push(newPost);

    return {
      sucess: true,
      message: 'create post success',
    };
  }

  async translateWithPapago(text: string): Promise<string> {
    const translator = new Translator(
      process.env.PAPAGO_ID,
      process.env.PAPAGO_SECRET,
    );
    const result = await translator.translate(text, 'ko', 'en');

    console.log(result.text);
    return result.text;
  }

  async downloadImage(createImageURL: string) {
    const writer = fs.createWriteStream('./image.png');
    const response = await this.httpService.axiosRef({
      url: createImageURL,
      method: 'GET',
      responseType: 'arraybuffer',
    });

    //console.log(response.data);
    await this.uploadFileTo(response.data);

    //response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve);
      writer.on('error', reject);
    });
  }

  async uploadFileTo(file: any) {
    const s3 = new Aws.S3({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    console.log(file);
    try {
      return await s3
        .upload({
          Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
          Key: `${1234}.png`,
          Body: file,
          ContentType: 'Content-Type: image/png',
        })
        .promise();
    } catch (err) {
      console.error(err);
    }
  }
  async getAllPost(): Promise<any> {
    return this.postRepository.find({});
  }
}
