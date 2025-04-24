import { useTheme } from "./ThemeProvider";
import { ThemeToggle } from "./ui/theme-toggle";
import { Link } from "wouter";

export default function Header() {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-semibold tracking-tight">Smartlet</a>
        </Link>
        
        <div className="flex items-center space-x-6">
          <ThemeToggle />
          
          <nav className="flex items-center space-x-6">
            <Link href="/">
              <a className="hover:text-primary transition-colors">Home</a>
            </Link>
            <Link href="/cart">
              <a className="hover:text-primary transition-colors">Cart</a>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
