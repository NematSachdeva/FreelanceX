import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-semibold mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-6">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
      <Link href="/" className="underline">
        Go back home
      </Link>
    </div>
  )
}
