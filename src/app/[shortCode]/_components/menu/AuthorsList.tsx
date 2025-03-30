'use client';

import './AuthorsList.css';
import { useState, useEffect } from 'react';
import { Author } from '@/types/types';

const fetchAuthors = async (): Promise<Author[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/authors/`);
  if (!res.ok) {
    throw Error('Failed to fetch authors');
  }
  return res.json();
};

const AuthorsList = ({ onSelect }: { onSelect: (author: Author) => void }) => {
  const [authors, setAuthors] = useState<Author[] | null>(null);

  useEffect(() => {
    fetchAuthors().then((authors) => {
      setAuthors(authors);
    });
  }, []);

  return (
    <div className="authors-list">
      {authors &&
        authors.map((author, index) => (
          <div
            key={index}
            className="author-list-item"
            onClick={() => onSelect(author)}
          >
            <img
              src={author.logo}
              alt={author.name}
              className="author-list-logo"
            />
            <div className="author-list-name">{author.name}</div>
          </div>
        ))}
    </div>
  );
};

export default AuthorsList;
