import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { JsonContains, Repository } from 'typeorm';
import { OpenAIClient } from '@platohq/nestjs-openai';
import Translator from 'papago';
import { User } from '../user/entity/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
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

  async getAllPost(): Promise<any> {
    return this.postRepository.find({});
  }
}
