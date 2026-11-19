import type { Metadata, Viewport } from 'next';
import ThemeRegistry from '../theme/ThemeRegistry';

export const metadata: Metadata = {
  title: 'Flood Control MD — Municipal Flood Monitoring System',
  description:
    'Demonstration flood zone map and emergency monitoring alert interface for municipal civil defense and public safety.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0B2545' },
    { media: '(prefers-color-scheme: dark)', color: '#0B132B' },
  ],
};

const antiFoucScript = `
  (function() {
    try {
      var saved = localStorage.getItem('flood-control-theme-mode');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var isDark = saved === 'dark' || (saved !== 'light' && prefersDark);
      var root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
        root.dataset.theme = 'dark';
        root.style.backgroundColor = '#0B132B';
        root.style.colorScheme = 'dark';
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        root.dataset.theme = 'light';
        root.style.backgroundColor = '#F4F7FB';
        root.style.colorScheme = 'light';
      }
    } catch(e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: antiFoucScript }} />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
