import './globals.css';

export const metadata = {
  title: 'SOFO ProjectOS — Enterprise Project Operating System',
  description: 'Systematic Project Operating System for root-cause analysis, requirement mapping, and solution verification.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#090a0f',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#090a0f] text-zinc-100 antialiased selection:bg-[#39FF14] selection:text-black min-h-[100dvh] w-full overflow-x-hidden font-sans">
        {children}
      </body>
    </html>
  );
}
