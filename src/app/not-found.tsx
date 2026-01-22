import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">404 - Not Found</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
