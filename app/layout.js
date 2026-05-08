import './globals.css';

export const metadata = {
  title: 'TeachSheet AI - Worksheet & Quiz Generator',
  description: 'Free AI tool for teachers. Create Common Core aligned worksheets and quizzes in seconds.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
