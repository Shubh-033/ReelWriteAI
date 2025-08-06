import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Heart, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface UserStats {
  totalScripts: number;
  weeklyScripts: number;
  favoriteScripts: number;
  successRate: number;
}

export default function Analytics() {
  const { token } = useAuth();

  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ['/api/analytics/stats'],
    enabled: !!token,
  });

  const statCards = [
    {
      title: "Total Scripts",
      value: stats?.totalScripts || 0,
      icon: FileText,
      color: "electric-blue",
      description: "Scripts created"
    },
    {
      title: "This Week",
      value: stats?.weeklyScripts || 0,
      icon: Calendar,
      color: "neon-pink",
      description: "Recent activity"
    },
    {
      title: "Favorites",
      value: stats?.favoriteScripts || 0,
      icon: Heart,
      color: "lime-green",
      description: "Saved favorites"
    },
    {
      title: "Success Rate",
      value: `${stats?.successRate || 0}%`,
      icon: TrendingUp,
      color: "purple-500",
      description: "Content quality"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-4 gap-6 mb-8"
      >
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="ml-4 flex-1">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid md:grid-cols-4 gap-6 mb-8"
    >
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="hover-lift cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <motion.div 
                    className={`w-12 h-12 bg-${stat.color}/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    <IconComponent 
                      className={`text-${stat.color}`} 
                      size={24} 
                    />
                  </motion.div>
                  <div className="ml-4">
                    <motion.div 
                      className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                      {stat.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
