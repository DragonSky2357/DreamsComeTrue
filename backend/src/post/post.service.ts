import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { JsonContains, Repository } from 'typeorm';
import { OpenAIClient } from '@platohq/nestjs-openai';
import Translator from 'papago';
import { User } from '../user/entity/user.entity';
import { HttpService } from '@nestjs/axios';
import fs from 'fs';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
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

    console.log(response.data);

    await this.downloadImage();

    const savePost = {
      title: createPost.title,
      bodyText: createPost.bodyText,
      imageUrl: response.data.data[0].url,
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

  async downloadImage() {
    const writer = fs.createWriteStream('./image.png');
    const response = await this.httpService.axiosRef({
      url: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-vznyuFW1peOTpU35dpJgXKhv/user-o3JO9A4Vu4YVNOOVjlTe4RJk/img-nPf4lo7LcUZouKzw5XxHNKK6.png?st=2023-03-19T13%3A30%3A43Z&se=2023-03-19T15%3A30%3A43Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-03-19T12%3A35%3A41Z&ske=2023-03-20T12%3A35%3A41Z&sks=b&skv=2021-08-06&sig=DCXnxw6yX2VnfEHtJMDX72Do2wumjYcV0LKMVATYztY%3D',
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve);
      writer.on('error', reject);
    });
  }
  async getAllPost(): Promise<any> {
    return this.postRepository.find({});
  }
}
