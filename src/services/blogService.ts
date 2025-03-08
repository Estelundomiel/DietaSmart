import { BlogPost } from '../types';

// Carica i post dal localStorage o usa quelli di default
const DEFAULT_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Benvenuti nel Blog Nutrizionale',
    content: `
      Benvenuti nel nostro blog dedicato alla nutrizione e al benessere! 
      Qui troverete consigli, ricette e approfondimenti per mantenere uno stile di vita sano ed equilibrato.
      
      La corretta alimentazione è fondamentale per il nostro benessere quotidiano. Non si tratta solo di 
      contare calorie, ma di comprendere come i diversi alimenti influenzano il nostro organismo e come 
      possiamo combinare i cibi per ottenere il massimo beneficio.
      
      Seguiteci per rimanere aggiornati sui nostri consigli nutrizionali!
    `,
    excerpt: 'Benvenuti nel nostro blog dedicato alla nutrizione e al benessere! Qui troverete consigli, ricette e approfondimenti...',
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800',
    createdAt: new Date().toISOString()
  }
];

const STORAGE_KEY = 'app_blog_posts';

function loadPosts(): BlogPost[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_POSTS;
  } catch {
    return DEFAULT_POSTS;
  }
}

function savePosts(posts: BlogPost[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error('Errore nel salvataggio dei post:', error);
  }
}

let posts: BlogPost[] = loadPosts();

export async function getAllPosts(): Promise<BlogPost[]> {
  return [...posts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getLatestPost(): Promise<BlogPost | null> {
  const sortedPosts = await getAllPosts();
  return sortedPosts[0] || null;
}

export async function createPost(post: Omit<BlogPost, 'id' | 'createdAt'>): Promise<BlogPost> {
  const newPost: BlogPost = {
    ...post,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };

  posts.push(newPost);
  savePosts(posts);
  return newPost;
}

export async function updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) return null;

  posts[index] = { ...posts[index], ...updates };
  savePosts(posts);
  return posts[index];
}

export async function deletePost(id: string): Promise<boolean> {
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) return false;

  posts.splice(index, 1);
  savePosts(posts);
  return true;
}