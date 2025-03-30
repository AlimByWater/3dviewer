import { Author } from '@/types/types';
import Image from 'next/image';
import styles from './AuthorLogo.module.css';

const AuthorLogo = ({
  author,
  className,
  size = 40,
}: {
  author: Author;
  className?: string;
  size?: number;
}) => {
  const src =
    author.logo === ''
      ? `${process.env.NEXT_PUBLIC_BASE_PATH}/logo-placeholder.png`
      : author.logo;

  return (
    <Image
      src={src}
      alt={author.name}
      width={size}
      height={size}
      className={`${styles.logo} ${className}`}
      // style={{ width: size, height: size }}
    />
  );
};
export default AuthorLogo;
