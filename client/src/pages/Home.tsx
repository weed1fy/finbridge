import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Filter, Users, GraduationCap } from "lucide-react";
import { Link } from "wouter";
import { useRef } from "react";
import { MotionContainer, MotionItem } from "@/components/Motion";

export default function Home() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start end", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen" data-testid="section-hero">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1200"
            alt="Modern financial district skyline"
            className="w-full h-full object-cover object-center opacity-35 dark:opacity-25"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center py-0">
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="w-full">
            <MotionContainer className="text-center max-w-4xl mx-auto">
              <MotionItem>
                <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight" style={{ font: '700 60px/60px "Times New Roman", serif' }}>
                  <div style={{ fontFamily: 'Times New Roman, serif' }}>
                    Bringing Wall Street to{" "}
                  </div>
                  <div className="inline font-bold" style={{ color: 'rgba(25, 95, 255, 1)' }}>
                    Every Street
                  </div>
                </h1>
              </MotionItem>

              <MotionItem>
                <div style={{ fontFeatureSettings: 'normal', maxWidth: '768px', margin: '0 auto 32px', font: 'italic 400 20px/28px "Times New Roman", serif' }}>
                  Our mission is to bridge the gap between knowledge and capital markets by offering cutting-edge screening tools and a first-of-its-kind Student Managed Investment Fund, fostering financial literacy and confident investing.
                </div>
              </MotionItem>

              <MotionItem />
            </MotionContainer>
          </motion.div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <motion.button
              aria-label="Scroll down"
              onClick={() => document.getElementById('section-features')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-12 h-12 rounded-full flex items-center justify-center glass"
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </motion.button>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="section-features" className="max-w-7xl mx-auto px-6 py-20" data-testid="section-features">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Tools for Smart Investing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to make informed investment decisions in Pakistan's stock market
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Stock Screener */}
          <MotionItem className="bg-card rounded-xl p-8 border border-border hover-lift" whileHover={{ y: -4 }} data-testid="card-feature-screener">
            <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mb-6">
              <Filter className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Stock Screener</h3>
            <p className="text-muted-foreground mb-4">
              Discover stocks with our advanced screening tool powered by 20+ performance and risk indicators. Designed for both beginners and experienced investors.
            </p>
            <Link href="/screener" className="text-primary font-semibold hover:underline inline-flex items-center" data-testid="link-explore-screener">
              Explore Screener <ArrowRight size={16} className="ml-2" />
            </Link>
          </MotionItem>

          {/* MAYS SMIF */}
          <MotionItem className="bg-card rounded-xl p-8 border border-border hover-lift" whileHover={{ y: -4 }} data-testid="card-feature-smif">
            <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mb-6">
              <Users className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">MAYS SMIF</h3>
            <p className="text-muted-foreground mb-4">
              Pakistan's first Student Managed Investment Fund. A unique opportunity for students to learn by managing a real portfolio.
            </p>
            <Link href="/smif" className="text-primary font-semibold hover:underline inline-flex items-center" data-testid="link-join-smif">
              Join Now <ArrowRight size={16} className="ml-2" />
            </Link>
          </MotionItem>

          {/* Education */}
          <MotionItem className="bg-card rounded-xl p-8 border border-border hover-lift" whileHover={{ y: -4 }} data-testid="card-feature-learn">
            <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mb-6">
              <GraduationCap className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Learn Before Invest</h3>
            <p className="text-muted-foreground mb-4">
              Financial literacy is the foundation of smart investing. Access guides, courses, and insights to understand market concepts and strategies.
            </p>
            <Link href="/learn" className="text-primary font-semibold hover:underline inline-flex items-center" data-testid="link-start-learning">
              Start Learning <ArrowRight size={16} className="ml-2" />
            </Link>
          </MotionItem>
        </div>
      </section>
    </div>
  );
}
