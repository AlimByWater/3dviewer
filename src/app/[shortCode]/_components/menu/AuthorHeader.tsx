import { Author } from '@/types/types';
import styles from './AuthorHeader.module.css';
import { Avatar, Button, ButtonProps, Text } from '@mantine/core';

const ChannelButton = (
  props: ButtonProps & React.ComponentPropsWithoutRef<'a'>,
) => {
  return <Button component="a" variant="outline" {...props} />;
};

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
      <ChannelButton
        href={author.channel}
        color="black"
        size="compact-sm"
        target="_blank"
        rel="noopener noreferrer"
      >
        Канал
      </ChannelButton>
      {onOtherAuthorsClick && (
        <button onClick={onOtherAuthorsClick}>Другие авторы</button>
      )}
    </div>
  );
};

export default AuthorHeader;
