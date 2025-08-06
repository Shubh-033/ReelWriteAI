import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function About() {
  const stats = [
    { value: "10K+", label: "Scripts Generated", color: "electric-blue" },
    { value: "500+", label: "Active Creators", color: "neon-pink" },
    { value: "95%", label: "User Satisfaction", color: "lime-green" },
    { value: "24/7", label: "AI Availability", color: "purple-500" },
  ];

  const features = [
    "Free Hugging Face AI integration",
    "Unlimited script generation",
    "Community-driven insights",
  ];

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
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              About ReelWrite AI
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              We're revolutionizing content creation with AI-powered script generation. 
              Our platform helps creators, marketers, and businesses generate engaging 
              content that resonates with their audience and drives results.
            </p>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                >
                  <div className={`w-6 h-6 bg-${index === 0 ? 'electric-blue' : index === 1 ? 'neon-pink' : 'lime-green'} rounded-full flex items-center justify-center mr-3`}>
                    <Check className="text-white" size={12} />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="relative"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Animated statistics cards */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`bg-gradient-to-br from-${stat.color}/10 to-${stat.color}/5 rounded-xl p-6 hover-lift`}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div 
                    className={`text-2xl font-bold text-${stat.color} mb-2`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
