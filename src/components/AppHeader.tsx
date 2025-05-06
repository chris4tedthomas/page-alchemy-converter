
import { Code } from "lucide-react";

const AppHeader = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 font-semibold">
          <Code className="h-6 w-6 text-brand-600" />
          <span className="text-lg">Page Alchemy</span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-4">
            <a href="#" className="text-sm font-medium transition-colors hover:text-primary">
              How It Works
            </a>
            <a href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Documentation
            </a>
            <a href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
