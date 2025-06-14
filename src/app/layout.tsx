import './globals.css';
import { Inter } from 'next/font/google';
import { TRPCProvider } from '@/components/providers/TRPCProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Menu Price AI',
  description: 'Update menu prices with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
