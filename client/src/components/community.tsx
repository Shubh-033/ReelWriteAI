import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Heart, Share2, User } from "lucide-react";

interface CommunityScript {
  id: string;
  anonymousUsername: string;
  likes: number;
  shares: number;
  script: {
    niche: string;
    contentType: string;
    hook: string;
  };
}

export default function Community() {
  const { data: communityScripts = [], isLoading } = useQuery<CommunityScript[]>({
    queryKey: ['/api/community/scripts'],
  });

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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const getBadgeColor = (index: number) => {
    const colors = ['electric-blue', 'neon-pink', 'lime-green'];
    return colors[index % colors.length];
  };

  const getBadgeText = (index: number, likes: number) => {
    if (likes > 1000) return 'Viral';
    if (index === 0) return 'Trending';
    return 'New';
  };

  return (
    <section id="community" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Community Showcase
          </h2>
          <p className="text-xl text-gray-600">
            See what amazing content our creators are generating
          </p>
        </motion.div>
        
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="ml-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex justify-between">
                  <div className="flex space-x-4">
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {communityScripts.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-lg hover-lift group"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                }}
              >
                <div className="flex items-center mb-4">
                  <motion.div 
                    className={`w-10 h-10 bg-gradient-to-r from-${getBadgeColor(index)} to-${getBadgeColor(index + 1)} rounded-full flex items-center justify-center`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <User className="text-white" size={16} />
                  </motion.div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900">
                      @{item.anonymousUsername}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.script.niche} • {item.script.contentType}
                    </div>
                  </div>
                </div>
                <motion.div 
                  className="bg-gray-50 rounded-lg p-4 mb-4 group-hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-sm text-gray-800">
                    "{item.script.hook}..."
                  </div>
                </motion.div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <motion.span 
                      className="flex items-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Heart className="text-red-400 mr-1" size={16} />
                      {item.likes.toLocaleString()}
                    </motion.span>
                    <motion.span 
                      className="flex items-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Share2 className="text-blue-400 mr-1" size={16} />
                      {item.shares}
                    </motion.span>
                  </div>
                  <motion.span 
                    className={`text-xs bg-${getBadgeColor(index)}/10 text-${getBadgeColor(index)} px-2 py-1 rounded-full`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {getBadgeText(index, item.likes)}
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
