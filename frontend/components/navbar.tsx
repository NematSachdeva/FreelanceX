"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { getToken } from "@/lib/auth"
import { User, LogOut, LayoutDashboard, Settings, Package, ShoppingBag } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken()
      const userStr = localStorage.getItem('user')
      const userData = userStr ? JSON.parse(userStr) : null
      setIsAuthenticated(!!token)
      setUser(userData)
    }

    // Check auth on mount
    checkAuth()

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuth()
      }
    }

    // Listen for custom auth events
    const handleAuthChange = () => {
      checkAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('authChange', handleAuthChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authChange', handleAuthChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
    setDropdownOpen(false)
    
    // Trigger auth change event
    window.dispatchEvent(new Event('authChange'))
    
    router.push('/')
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md border border-border px-3 py-2 hover:bg-accent"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="fill-foreground">
              <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
            </svg>
          </button>
          <Link href="/" className="font-semibold text-foreground">
            FreelanceX
          </Link>
          <nav className="hidden md:flex items-center gap-4 ml-6">
            <Link
              className={cn(
                "text-sm transition-colors hover:text-foreground/90 hover:underline",
                pathname.startsWith("/explore") && "underline",
              )}
              href="/explore"
            >
              Explore
            </Link>
            {isAuthenticated && (
              <Link
                className={cn(
                  "text-sm transition-colors hover:text-foreground/90 hover:underline",
                  pathname.startsWith("/orders") && "underline",
                )}
                href="/orders"
              >
                Orders
              </Link>
            )}
            <Link
              className={cn(
                "text-sm transition-colors hover:text-foreground/90 hover:underline",
                pathname.startsWith("/become-seller") && "underline",
              )}
              href="/become-seller"
            >
              Become a Seller
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition"
              >
                <img
                  src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-foreground">{user.name}</span>
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-popover rounded-md shadow-lg border border-border z-50">
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <ShoppingBag className="w-4 h-4 mr-3" />
                      My Orders
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-3" />
                      Dashboard
                    </Link>
                    {(user.role === 'freelancer' || user.accountType === 'freelancer') && (
                      <Link
                        href="/services"
                        className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Package className="w-4 h-4 mr-3" />
                        My Services
                      </Link>
                    )}
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                    <hr className="my-1 border-border" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-accent"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/join">
                <Button>Join</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div id="mobile-menu" className={cn("md:hidden border-t border-border", open ? "block" : "hidden")}>
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2">
          <Link href="/explore" className="py-2 transition-colors hover:text-foreground/90 hover:underline text-foreground">
            Explore
          </Link>
          {isAuthenticated && (
            <Link href="/orders" className="py-2 transition-colors hover:text-foreground/90 hover:underline text-foreground">
              Orders
            </Link>
          )}
          <Link href="/become-seller" className="py-2 transition-colors hover:text-foreground/90 hover:underline text-foreground">
            Become a Seller
          </Link>
          
          {isAuthenticated && user ? (
            <>
              <hr className="my-2 border-border" />
              <div className="flex items-center gap-3 py-2">
                <img
                  src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{user.role || user.accountType}</p>
                </div>
              </div>
              <Link href="/profile" className="py-2 transition-colors hover:text-foreground/90 hover:underline text-foreground">
                My Profile
              </Link>
              <Link href="/orders" className="py-2 transition-colors hover:text-foreground/90 hover:underline text-foreground">
                My Orders
              </Link>
              <Link href="/dashboard" className="py-2 transition-colors hover:text-foreground/90 hover:underline text-foreground">
                Dashboard
              </Link>
              {(user.role === 'freelancer' || user.accountType === 'freelancer') && (
                <Link href="/services" className="py-2 transition-colors hover:text-foreground/90 hover:underline text-foreground">
                  My Services
                </Link>
              )}
              <Link href="/settings" className="py-2 transition-colors hover:text-foreground/90 hover:underline text-foreground">
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="py-2 text-left text-destructive transition-colors hover:text-destructive/90"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 mt-2">
              <Link href="/auth/signin" className="flex-1">
                <Button variant="ghost" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/join" className="flex-1">
                <Button className="w-full">Join</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
