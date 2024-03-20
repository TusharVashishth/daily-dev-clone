type AuthStateType = {
  email?: string;
  name?: string;
  password?: string;
  username?: string;
  password_confirmation?: string;
};

type PostStateType = {
  title?: string;
  url?: string;
  image_url?: string;
  description?: string;
};

type ImagePreviewResType = {
  url: string;
  title: string;
  siteName: string | undefined;
  description: string | undefined;
  mediaType: string;
  contentType: string | undefined;
  images: string[];
  videos: {};
  favicons: string[];
};

type APIResponseType<T> = {
  data: Array<T>;
  path: string;
  per_page: number;
  next_cursor: string;
  next_page_url?: string;
  prev_cursor?: string;
  prev_page_url?: string;
};

type PostApiType = {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  url?: string;
  created_at: string;
  vote: number;
  comment_count: number;
  user_id: number;
  user: UserType;
};
type CommentType = {
  id: number;
  post_id: number;
  user_id: number;
  created_at: string;
  comment: string;
  user: UserType;
};

type UserType = {
  id: number;
  name: string;
  email: string;
  username: string;
  profile_image: string;
};
