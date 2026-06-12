import { withBlogCoverImages } from "@/lib/blog-images";

import { empregoSaoLuisBlogPosts, type EmpregoSaoLuisBlogPost } from "./emprego-sao-luis-blog-posts";
import { empregoSaoLuisBlogPostsExtra } from "./emprego-sao-luis-blog-posts-extra";
import { empregoSaoLuisBlogPostsFinal } from "./emprego-sao-luis-blog-posts-final";

export type { EmpregoSaoLuisBlogPost };

export const empregoSaoLuisBlogPostsAll: EmpregoSaoLuisBlogPost[] = withBlogCoverImages([
  ...empregoSaoLuisBlogPosts,
  ...empregoSaoLuisBlogPostsExtra,
  ...empregoSaoLuisBlogPostsFinal
]);
