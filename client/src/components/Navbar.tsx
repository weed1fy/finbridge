import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

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
          <a href="https://b253b3edbe4d49088e637281fd3070a3-6fdc90ccde5b453c9bc61775a.fly.dev/" data-testid="link-home">
            <div className="flex items-center cursor-pointer">
              <span className="ml-2 text-foreground" style={{ font: '700 20px/28px "Times New Roman", serif' }}>FINBRIDGE</span>
            </div>
          </a>

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
