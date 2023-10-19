import { Tag } from './../shared/entities/tag.entity';
import { Comment } from './../shared/entities/comment.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
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
      .loadRelationCountAndMap('post.views', 'post.views')
      .loadRelationCountAndMap('post.likes', 'post.likedUser')
      .select(['post.id', 'post.title', 'post.image'])
      .addSelect(['writer.avatar', 'writer.username'])
      .leftJoin('post.writer', 'writer')
      .orderBy('RAND()')
      .getMany();
  }

  async createPost(id: string, createPostDto: CreatePostDto): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['post'],
      });

      if (!user) {
        throw new UnauthorizedException('존재하지 않은 유저입니다.');
      }

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
      throw new BadRequestException(e);
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

  async getPostById(userId: string, postId: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['writer', 'tags', 'comments', 'views', 'likedUser'],
      cache: true,
    });

    post.views.push(user);
    await this.postRepository.save(post);

    const comments = await this.getCommentsById(postId);

    const result = {
      id: post.id,
      title: post.title,
      describe: post.describe,
      image: post.image,
      tags: post.tags,
      comments,
      writer: {
        avatar: user.avatar,
        username: user.username,
      },

      views: post.views.length,
      likes: post.likedUser.length,
      created_at: post.created_at,
    };

    console.log(result);
    return result;
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
    userId: string,
    postId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<any> {
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
    comment.writer = user;
    comment.post = post;

    await this.commentRepository.save(comment);
  }

  async getCommentsById(postId: string): Promise<any> {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
      select: ['id'],
    });

    const comments = await this.commentRepository.find({
      where: {
        post,
      },
      relations: {
        writer: true,
      },
      select: ['comment', 'created_at', 'writer'],
      order: {
        created_at: 'DESC',
      },
    });

    if (!post) {
      throw new UnauthorizedException('Post not found');
    }

    const result = [];

    comments.map((comment) => {
      result.push({
        comment: comment.comment,
        create_at: comment.created_at,
        writer: {
          username: comment.writer.username,
          avatar: comment.writer.avatar,
        },
      });
    });

    return result;
  }

  async getCommentById(postId: string, commentId: string): Promise<any> {
    return null;
  }
  async updatePostLike(userId: string, postId: string): Promise<any> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: {
        likedUser: true,
      },
    });

    if (!post) {
      return new NotFoundException('찾을 수 없는 포스트입니다.');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        likedPosts: true,
      },
    });

    if (!user) {
      return new UnauthorizedException('존재하지 않은 유저입니다.');
    }

    const likedPost = user.likedPosts.findIndex(
      (likedPost) => likedPost.id === post.id,
    );

    const likedUser = post.likedUser.findIndex(
      (likedUser) => likedUser.id === post.id,
    );

    console.log(likedPost);
    console.log(likedUser);

    if (likedPost === -1) {
      user.likedPosts.push(post);
    } else {
      user.likedPosts.splice(likedPost, 1);
    }

    await this.userRepository.save(user);

    console.log(5);
    return {
      sucess: true,
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
