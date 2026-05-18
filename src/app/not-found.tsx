import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-8">
      <div className="text-center">
        <p className="text-indigo-400 text-sm font-mono uppercase tracking-widest mb-6">
          404
        </p>
        <h1 className="text-6xl md:text-8xl font-black text-white mb-4">
          Not found
        </h1>
        <p className="text-white/30 mb-12 text-lg">
          This page doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="text-white/50 hover:text-white text-sm underline underline-offset-4 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
