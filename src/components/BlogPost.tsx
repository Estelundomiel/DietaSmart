import React from 'react';
import { Calendar } from 'lucide-react';
import { BlogPost as BlogPostType } from '../types';

interface BlogPostProps {
  post: BlogPostType;
  isPreview?: boolean;
}

export function BlogPost({ post, isPreview = false }: BlogPostProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <Calendar className="w-4 h-4 mr-2" />
          {formattedDate}
        </div>
        <div className="prose max-w-none">
          {isPreview ? (
            <>
              <p>{post.excerpt}</p>
              <a href="#" className="text-green-600 hover:text-green-700 font-medium inline-flex items-center mt-4">
                Leggi di più →
              </a>
            </>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }} />
          )}
        </div>
      </div>
    </article>
  );
}