import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <div className="bg-background sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-primary">AEGIR</div>

        <nav className="flex items-center gap-6">
          <>
            <a
              href="#"
              className="text-sm text-foreground hover:text-primary transition"
            >
              Home
            </a>
            <a
              href="/admin/session"
              className="text-sm text-foreground hover:text-primary transition"
            >
              Schedules
            </a>
            <a href="/admin/profile" className="text-sm hover:text-primary transition">
              Profile
            </a>
            <Button variant="outline">Logout</Button>
          </>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
