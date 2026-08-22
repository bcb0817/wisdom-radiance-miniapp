export type CommunityPost = {
  id: string; displayName: string; ageRange: string; topic: string; title: string;
  body: string; createdAt: string; likes: number; comments: CommunityComment[];
};
export type CommunityComment = { id: string; displayName: string; body: string; createdAt: string };
