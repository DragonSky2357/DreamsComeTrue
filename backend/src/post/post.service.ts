import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { Repository } from 'typeorm';
import { OpenAIClient } from '@platohq/nestjs-openai';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private readonly openAIClient: OpenAIClient,
  ) {}

  async create(prompt: string): Promise<any> {
    const response = await this.openAIClient.createImage({
      prompt: 'a white siamese cat',
      n: 1,
      size: '1024x1024',
    });

    return response.data.data[0].url;
  }
}
