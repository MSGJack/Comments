export type UserType = {
  image: {
    png: string;
    webp: string;
  };
  username: string;
};

export type ReplyType = {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  replyingTo: string;
  user: UserType;
};

export type CommentType = {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: UserType;
  replies: ReplyType[];
};

