import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    category: z.enum([
      'Backups',
      'Virtualization',
      'Cloud',
      'Monitoring',
      'Networking',
      'Security',
      'Automation',
      'Windows Server',
      'Linux'
    ]),
    tags: z.array(z.string()).optional(),
    author: z.string().default('Ahmed'),
  })
});

export const collections = {
  'blog': blogCollection,
};
