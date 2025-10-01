import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/screener", label: "Screener" },
    { href: "/smif", label: "MAYS SMIF" },
    { href: "/about", label: "About Us" },
    { href: "/learn", label: "Learn" },
  ];

  return (
    <header className="glass sticky top-0 z-50 shadow-sm" data-testid="navbar">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-foreground">FINBRIDGE</span>
            </div>
          </Link>

          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <motion.a
                  className={`text-sm font-medium transition-colors relative ${
                    location === link.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  whileHover={{ y: -2 }}
                >
                  {link.label}
                  {location === link.href && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                      layoutId="navbar-indicator"
                    />
                  )}
                </motion.a>
              </Link>
            ))}
          </div>

          <button
            className="px-4 py-2 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            data-testid="button-get-started"
          >
            Get Started
          </button>
        </div>
      </nav>
    </header>
  );
}
