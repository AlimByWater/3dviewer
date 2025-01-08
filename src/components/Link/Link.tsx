import { openLink, classNames } from '@telegram-apps/sdk-react';
import { type FC, type MouseEventHandler, useCallback } from 'react';

import { Link as LinkComponent, LinkProps } from 'react-router';
// TODO: Add TailwindCSS if necessary

import './styles.css';

export const Link: FC<LinkProps> = ({
  className,
  onClick: propsOnClick,
  to,
  ...rest
}) => {
  // Compute if target path is external. In this case we would like to open link using
  // TMA method.
  const onClick = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    (e) => {
      propsOnClick?.(e);

      let path: string;
      if (typeof to === 'string') {
        path = to;
      } else {
        const { search = '', pathname = '', hash = '' } = to;
        path = `${pathname}?${search}#${hash}`;
      }

      const targetUrl = new URL(path, window.location.toString());
      const currentUrl = new URL(window.location.toString());
      const isExternal =
        targetUrl.protocol !== currentUrl.protocol ||
        targetUrl.host !== currentUrl.host;

      if (isExternal) {
        e.preventDefault();
        openLink(targetUrl.toString());
      }
    },
    [to, propsOnClick]
  );

  return (
    <LinkComponent
      {...rest}
      to={to}
      onClick={onClick}
      className={classNames(className, 'link')}
    />
  );
};
