import Providers from 'app/providers';
import './globals.css';
import GlobalSOSListener from '@/components/GlobalSOSListener';
import GlobalNotificationListener from '@/components/GlobalNotificationListener';
import SoundGate from '@/components/SoundGate';
import RemoveInjectedAttributes from '@/components/RemoveInjectedAttributes';
export const metadata = {
  title: 'KnectHotel',
  description:
    'A user admin dashboard configured with Next.js, Postgres, NextAuth, Tailwind CSS, TypeScript, and Prettier.'
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="w-full bg-background overflow-hidden">
        {}
        <RemoveInjectedAttributes />
        <SoundGate />
        <GlobalSOSListener />
        <GlobalNotificationListener />
        {children}
      </body>
    </html>
  );
};
export default RootLayout;
