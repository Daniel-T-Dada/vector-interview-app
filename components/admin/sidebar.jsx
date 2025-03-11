"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, Settings, Menu, X, LogOut, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export function AdminSidebar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  // Handle mounting to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isOpen && !event.target.closest('[data-sidebar]') && !event.target.closest('[data-sidebar-toggle]')) {
        setIsOpen(false);
      }
    };

    // Close sidebar when route changes
    const handleRouteChange = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('click', handleOutsideClick);
      window.addEventListener('popstate', handleRouteChange);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [isOpen, pathname]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Interviews",
      href: "/dashboard/interviews",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  if (!isMounted) return null;

  return (
    <>
      {/* Mobile menu button - only visible when sidebar is closed */}
      {!isOpen && (
        <div className="fixed top-0 left-0 z-[100] p-4 md:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
            aria-label="Toggle menu"
            data-sidebar-toggle
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside
        data-sidebar
        className={cn(
          "fixed inset-y-0 left-0 z-[90] w-64 bg-card border-r border-border shadow-lg transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full pt-4 md:pt-0">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="text-xl font-bold">Vector Interview</span>
            </Link>
            {/* Close button inside sidebar header */}
            {isOpen && (
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Navigation links */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-3 rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Sidebar footer with user profile, theme toggle and sign out */}
          <div className="p-4 border-t border-border space-y-4">
            {session?.user && (
              <div className="flex items-center space-x-3 mb-4 p-3 rounded-md bg-muted/50">
                <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  {session.user.image ? (
                    <div className="relative h-full w-full">
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Image 
                        src={session.user.image} 
                        alt={session.user.name || "User"} 
                        width={40} 
                        height={40} 
                        className="h-full w-full object-cover relative z-10"
                        onError={(e) => {
                          // If image fails to load, hide it and show the fallback
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <User className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {session.user.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            
            <button 
              onClick={handleSignOut}
              className="flex items-center space-x-2 w-full px-4 py-2 rounded-md text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile - improved with opacity transition */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
} 