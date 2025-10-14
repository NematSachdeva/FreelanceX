import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t mt-10">
      <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="font-semibold">FreelanceX</div>
          <p className="text-sm text-muted-foreground mt-2">A modern marketplace for freelancers and clients.</p>
        </div>
        <div>
          <div className="font-medium mb-2">Explore</div>
          <ul className="space-y-1 text-sm">
            <li>
              <Link className="hover:underline" href="/explore">
                All Services
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/become-seller">
                Become a Seller
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-2">Account</div>
          <ul className="space-y-1 text-sm">
            <li>
              <Link className="hover:underline" href="/auth/signin">
                Sign In
              </Link>
            </li>
            <li>
              <Link className="hover:underline" href="/auth/join">
                Join
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground pb-6">
        © {new Date().getFullYear()} FreelanceX. All rights reserved.
      </div>
    </footer>
  )
}
