import { Author } from '@/types/types';
import styles from './AuthorHeader.module.css';
import { Avatar, Button, ButtonProps, Text } from '@mantine/core';

export function GoogleButton(
  props: ButtonProps & React.ComponentPropsWithoutRef<'button'>,
) {
  return <Button variant="default" {...props} />;
}

const AuthorHeader = ({
  author,
  onOtherAuthorsClick,
}: {
  author: Author;
  onOtherAuthorsClick: (() => void) | null;
}) => {
  return (
    <div className={styles.wrapper}>
      <Avatar src={author.logo} size="sm" className={styles.logo} />
      <Text fz="h4" fw={600} className={styles.name}>
        {author.name}
      </Text>
      <Button size="compact-sm" color="black">
        Канал
      </Button>
      {onOtherAuthorsClick && (
        <button onClick={onOtherAuthorsClick}>Другие авторы</button>
      )}
    </div>
  );
};

export default AuthorHeader;
