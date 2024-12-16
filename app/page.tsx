import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hello World</h1>
      <div className="mb-4">
        <Link href="/posts" className="text-blue-500 hover:underline">
          Posts
        </Link>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Categories</h2>
        <ul>
          <li>
            <Link href="/shorts" className="text-blue-500 hover:underline">
              Shorts
            </Link>
          </li>
          <li>
            <Link href="/tech" className="text-blue-500 hover:underline">
              Tech
            </Link>
          </li>
          <li>
            <Link href="/life" className="text-blue-500 hover:underline">
              Life
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
