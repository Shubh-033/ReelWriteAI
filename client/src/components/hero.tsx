import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Rocket, Play, WandSparkles, Heart, Share } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";

export default function Hero() {
  const { isAuthenticated } = useAuth();

  const openDemo = () => {
    window.open('https://youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="pt-24 pb-20 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-8">
            <motion.div className="space-y-4" variants={itemVariants}>
              <motion.h1 
                className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                Create Viral Scripts with{' '}
                <span className="gradient-text">
                  AI Power
                </span>
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 leading-relaxed"
                variants={itemVariants}
              >
                Generate engaging hooks, compelling content, and powerful CTAs for your social media content in seconds. Join thousands of creators scaling their content with AI.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <Link href={isAuthenticated ? "/dashboard" : "/login"}>
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,191,255,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg"
                    className="gradient-bg text-white px-8 py-4 text-lg font-semibold hover:shadow-xl transition-all duration-300"
                  >
                    <Rocket className="mr-2" size={20} />
                    Start Creating Scripts
                  </Button>
                </motion.div>
              </Link>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={openDemo}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 text-lg font-semibold hover:border-electric-blue hover:text-electric-blue transition-all duration-300"
                >
                  <Play className="mr-2" size={20} />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>
          </div>
          
          <motion.div 
            className="relative"
            variants={itemVariants}
          >
            {/* Dashboard Preview */}
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl p-6 hover-lift"
              initial={{ opacity: 0, rotateX: 20 }}
              animate={{ opacity: 1, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ y: -8, boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Script Generator</h3>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <motion.div 
                    className="bg-gray-50 rounded-lg p-3"
                    whileHover={{ backgroundColor: "#f0f9ff" }}
                  >
                    <label className="text-sm text-gray-600">Niche</label>
                    <div className="electric-blue font-medium">Fitness</div>
                  </motion.div>
                  <motion.div 
                    className="bg-gray-50 rounded-lg p-3"
                    whileHover={{ backgroundColor: "#fdf2f8" }}
                  >
                    <label className="text-sm text-gray-600">Content Type</label>
                    <div className="neon-pink font-medium">Instagram Reel</div>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-lg p-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <div className="text-sm text-gray-600 mb-2">Generated Script</div>
                  <div className="space-y-2 text-sm">
                    <div><strong>Hook:</strong> "This 30-second morning routine will..."</div>
                    <div><strong>Body:</strong> "Transform your energy levels..."</div>
                    <div><strong>CTA:</strong> "Follow for more fitness tips!"</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Floating elements */}
            <motion.div 
              className="absolute -top-4 -right-4 w-12 h-12 bg-lime-green rounded-full flex items-center justify-center animate-bounce-slow"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <WandSparkles className="text-white" size={20} />
            </motion.div>
            <motion.div 
              className="absolute -bottom-4 -left-4 w-16 h-16 bg-neon-pink/20 rounded-full animate-pulse-slow"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
