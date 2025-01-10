import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

import { Root } from '@/components/Root/Root';
import { I18nProvider } from '@/core/i18n/provider';
import { Inter } from 'next/font/google';

import '@telegram-apps/telegram-ui/dist/styles.css';
import 'normalize.css/normalize.css';
import './_assets/globals.css';

export const metadata: Metadata = {
  title: 'Your Application Title Goes Here',
  description: 'Your application description goes here',
};

const inter = Inter({ weight: ['400', '500', '600'], subsets: ['latin'] });

export default async function RootLayout({ children }: PropsWithChildren) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <I18nProvider>
          <Root>{children}</Root>
        </I18nProvider>
      </body>
    </html>
  );
}
