import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { PenIcon, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                  <PenIcon className="text-white" size={16} />
                </div>
                <span className="text-xl font-bold text-gray-900">ReelWrite AI</span>
              </div>
            </Link>
          </motion.div>
          
          {location === "/" && (
            <div className="hidden md:flex items-center space-x-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('features')}
                className="text-gray-600 hover:text-electric-blue transition-colors cursor-pointer"
              >
                Features
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('community')}
                className="text-gray-600 hover:text-neon-pink transition-colors cursor-pointer"
              >
                Community
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('about')}
                className="text-gray-600 hover:text-lime-green transition-colors cursor-pointer"
              >
                About
              </motion.button>
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-600 hidden md:block">Hi, {user?.fullName?.split(' ')[0]}</span>
                <Link href="/dashboard">
                  <Button variant="ghost" className="hover:bg-electric-blue hover:text-white">
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                    <LogIn size={16} className="mr-2" />
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="gradient-bg text-white hover:shadow-lg transition-all duration-300">
                      <UserPlus size={16} className="mr-2" />
                      Get Started
                    </Button>
                  </motion.div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
