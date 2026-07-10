import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-slate-100 font-sans selection:bg-purple-500/30">
      <Head>
        <title>Notice Board</title>
      </Head>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/60 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 cursor-pointer hover:opacity-80 transition">
              NoticeBoard
            </h1>
          </Link>
          <Link href="/new">
            <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2.5 rounded-full font-medium hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:-translate-y-0.5 transition-all duration-200">
              + Add Notice
            </button>
          </Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
}
