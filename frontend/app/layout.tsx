import './globals.css';
import { PlusCircle } from 'lucide-react';

export const metadata = {
  title: 'Hackathon Idea Generator',
  description: 'Generate creative ideas for hackathons',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 font-sans">
      {children}
      </body>
    </html>
  );
}
