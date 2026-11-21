// Blog posts, published on Medium. Newest first.
// To add a post, copy the example below into `posts` and fill it in:
//   { title: 'Same name, different cohort', date: '2026-12-01', summary: 'One or two sentences on what the post finds.', href: 'https://medium.com/@you/post-slug', tags: ['cohort-diff', 'MIMIC-IV'] },
// Set `mediumProfile` to your Medium profile URL to show a "Read on Medium" link.

export type BlogPost = {
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  href: string;
  tags?: string[];
};

export const mediumProfile = '';

export const posts: BlogPost[] = [];
