import Providers from 'app/providers';
import '../../globals.css';
export const metadata = {
  title: 'KnectHotel',
  description:
    'A user admin dashboard configured with Next.js, Postgres, NextAuth, Tailwind CSS, TypeScript, and Prettier.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main className="">{children}</main>
    </Providers>
  );
}
