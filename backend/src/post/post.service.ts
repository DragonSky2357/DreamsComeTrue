import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { Repository } from 'typeorm';
import { OpenAIClient } from '@platohq/nestjs-openai';
import Translator from 'papago';
import { User } from '../user/entity/user.entity';
import { HttpService } from '@nestjs/axios';
import { uploadFile } from './../common/utils/utils';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Tag } from './../shared/entities/tag.entity';
import { Comment } from './../shared/entities/comment.entity';
import { UpdatePostDto } from './dto/update-post-dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly httpService: HttpService,
    private readonly openAIClient: OpenAIClient,
  ) {}

  async getAllPost(): Promise<Post[]> {
    return await this.postRepository
      .createQueryBuilder('post')
      .leftJoin('post.writer', 'writer')
      .select([
        'post.id',
        'post.title',
        'post.image',
        'post.views_count',
        'post.likes_count',
      ])
      .addSelect(['writer.avatar', 'writer.username'])
      .orderBy('post.created_at', 'DESC')
      .getMany();
  }

  async getPostById(userId: string, postId: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('존재하지 않은 유저입니다.');
    }

    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['writer', 'tags', 'comments', 'views'],
      cache: true,
    });

    if (!post) {
      throw new BadRequestException('존재하지 않은 포스터입니다.');
    }

    const findViewUser = post.views.findIndex((u) => u.id === user.id);

    if (findViewUser === -1) {
      post.views.push(user);
      post.views_count = post.views_count + 1;
    }

    await this.postRepository.save(post);

    const result = {
      id: post.id,
      title: post.title,
      describe: post.describe,
      image: post.image,
      tags: post.tags,
      comments: post.comments,
      writer: {
        avatar: post.writer.avatar,
        username: post.writer.username,
      },
      views_count: post.views_count,
      likes_count: post.likes_count,
      created_at: post.created_at,
      updated_at: post.updated_at,
    };

    return result;
  }

  async createPost(id: string, createPostDto: CreatePostDto): Promise<void> {
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
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async updatePost(id: string, postId: string, updatePostDto: UpdatePostDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException('존재하지 않은 유저입니다.');
    }

    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['tags'],
    });

    if (!post) {
      throw new BadRequestException('존재하지 포스터입니다.');
    }

    if (post.writer != user) {
      throw new UnauthorizedException('업데이트 권한 없음');
    }

    let updatePost = {};

    if (updatePostDto.tags) {
      const tags: Tag[] = [];

      for (const tagName of updatePostDto.tags) {
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
      updatePost = {
        ...post,
        ...updatePostDto,
        tags,
      };
    } else {
      updatePost = {
        ...post,
        ...updatePostDto,
      };
    }

    await this.postRepository.save(updatePost);
  }

  async deletePost(id: string, postId: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException('존재하지 않은 유저입니다.');
    }

    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new BadRequestException('존재하지 포스터입니다.');
    }

    if (post.writer.id != user.id) {
      throw new UnauthorizedException('삭제 권한 없음');
    }

    await this.postRepository.remove(post);
  }
  async getPostByRanking(count: number): Promise<any> {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.writer', 'writer')
      .select(['post.id', 'post.title', 'post.image', 'writer.username'])
      .addSelect('COUNT(*)', 'likeCount')
      .groupBy('post.id')
      .orderBy('likeCount', 'DESC')
      .limit(count)
      .getMany();

    return post;
  }

  async createImage(title: string): Promise<{ image: string }> {
    try {
      const translateText = String(
        await this.translateWithPapago(title),
      ).concat(', digital art');

      const createImage = await this.openAIClient.createImage({
        prompt: translateText,
        n: 1,
        size: '1024x1024',
      });

      const createImageUrl: string = createImage.data.data[0].url;
      const resultImageUrl = await this.uploadImage(createImageUrl);

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

  async uploadImage(createImageUrl: string): Promise<string> {
    const imageURL = await this.downloadImage(createImageUrl);
    const uploadBucketResult = await uploadFile(imageURL, 'image');

    return uploadBucketResult.Key.split('/')[1];
  }

  async downloadImage(createImageUrl: string) {
    const response = await this.httpService.axiosRef({
      url: createImageUrl,
      method: 'GET',
      responseType: 'arraybuffer',
    });
    return response.data;
  }

  async getSearchPost(search: string): Promise<Post[]> {
    const findPost = await this.postRepository
      .createQueryBuilder('post')
      .leftJoin('post.writer', 'writer')
      .leftJoin('post.tags', 'tags')
      .where('post.title like :title', { title: `%${search}%` })
      .orWhere('post.describe like :describe', { describe: `%${search}%` })
      .select('post')
      .addSelect(['writer.avatar', 'writer.username'])
      .addSelect('tags.name')
      .getMany();

    return findPost;
  }

  async getTagPost(tagname: string): Promise<any> {
    const tags = await this.tagRepository.findOne({
      where: { name: tagname },
      relations: {},
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
      loadEagerRelations: false,
      select: ['id'],
    });

    console.log(post);

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
      relations: ['like_users'],
    });

    if (!post) {
      return new NotFoundException('찾을 수 없는 포스트입니다.');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return new UnauthorizedException('존재하지 않은 유저입니다.');
    }

    const likedUser = post.like_users.findIndex((u) => u.id === user.id);

    console.log(likedUser);

    if (likedUser === -1) {
      post.like_users.push(user);
      post.likes_count = post.likes_count + 1;
    } else {
      post.like_users.splice(likedUser, 1);
      post.likes_count = post.likes_count - 1;
    }

    await this.postRepository.save(post);

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
