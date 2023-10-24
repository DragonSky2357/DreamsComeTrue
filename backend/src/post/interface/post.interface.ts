import { Tag } from '../../shared/entities/tag.entity';
import { Comment } from '../../shared/entities/comment.entity';

export interface IPost {
  id: string;
  title: string;
  describe: string;
  image: string;
  tags: Tag[];
  comments: Comment[];
  writer: {
    avatar: string;
    username: string;
  };
  views: number;
  likes: number;
  created_at: Date;
}
