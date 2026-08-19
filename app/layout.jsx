import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import SoundCloudPlayer from '@/components/SoundCloudPlayer';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import AnimatedBackground from '@/components/AnimatedBackground';

export const metadata = {
  title: 'zverski napalen :3',
  description: 'Zverski Napalen official rap website',
  icons: {
    icon: '/images/logo01.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          <AnimatedBackground />
          {children}
          <SoundCloudPlayer />
          <ScrollToTopButton />
        </AuthProvider>
      </body>
    </html>
  );
}
