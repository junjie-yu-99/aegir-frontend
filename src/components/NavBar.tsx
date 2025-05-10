import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="bg-background sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-primary">AEGIR</div>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-foreground hover:text-primary transition"
          >
            Home
          </Link>
          <Link
            href="/admin/session"
            className="text-sm text-foreground hover:text-primary transition"
          >
            Schedules
          </Link>

          {/* When signed in, show user profile button */}
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          {/* When signed out, show login button */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="default">Log In</Button>
            </SignInButton>
          </SignedOut>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
