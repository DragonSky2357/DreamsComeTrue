import { Tag } from './../shared/entities/tag.entity';
import { Comment } from './../shared/entities/comment.entity';
import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
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
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

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

      const tags: Tag[] = [];

      for (const tagName of createPostDto.tags) {
        const tag = await this.tagRepository.findOne({
          where: { name: tagName },
        });

        if (!tag) {
          const newTag = await this.tagRepository.create({ name: tagName });
          await this.tagRepository.save(newTag);
          tags.push(newTag);
        } else {
          tags.push(tag);
        }
      }

      console.log(tags);

      const newPost = new Post({
        ...createPostDto,
        tags,
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

  async getPostById(postId: string): Promise<any> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['writer', 'comments', 'comments.user', 'tags'],
      cache: true,
      select: {
        id: true,
        title: true,
        describe: true,
        image: true,
        comments: true,

        writer: {
          username: true,
          avatar: true,
        },
        tags: true,
      },
    });

    console.log(post);
    return post;
  }

  async searchPost(search: string): Promise<any> {
    const findPost = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.writer', 'writer')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.title like :title', { title: `%${search}%` })
      .orWhere('post.describe like :describe', { describe: `%${search}%` })

      .getMany();

    return findPost;
  }

  async getTagPost(tagname: string): Promise<any> {
    const tags = await this.tagRepository.findOne({
      where: { name: tagname },
      relations: {
        posts: true,
      },
    });

    return tags;
  }
  async getUserPost(username: string): Promise<any> {
    const findPost = await this.userRepository.findOne({
      where: { username },
      relations: ['post'],
    });

    return findPost.post;
  }

  async createComment(
    userId: number,
    postId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<any> {
    console.log(createCommentDto);

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new UnauthorizedException('Post not found');
    }

    const comment = new Comment();
    comment.comment = createCommentDto.comment;
    comment.user = user;
    comment.post = post;
    await this.commentRepository.save(comment);
  }
  async updateLikePost(userId: number, postId: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['like_post'],
      select: ['id'],
    });

    if (!user) {
      return new Error('존재하지 않은 유저입니다.');
    }

    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['like_user'],
      select: ['id'],
    });

    if (!post) {
      return new Error('존재하지 않은 포스터입니다.');
    }

    const userIndex = post.like_user.findIndex((user) => user.id === userId);

    if (userIndex !== -1) {
      post.like_user.splice(userIndex, 1);
    } else {
      post.like_user.push(user);
    }

    await this.postRepository.save(post);
    return {
      sucess: 'true',
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
