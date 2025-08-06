import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { PenIcon, Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import ScriptGenerator from "@/components/script-generator";
import SavedScripts from "@/components/saved-scripts";
import Analytics from "@/components/analytics";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("generator");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <PenIcon className="text-white" size={16} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="text-sm text-gray-600 hidden md:block">
                Welcome back, {user?.fullName?.split(' ')[0]}!
              </span>
              <Button
                onClick={() => setActiveTab("generator")}
                className="gradient-bg text-white hover:shadow-lg transition-all duration-300"
              >
                <Plus size={16} className="mr-2" />
                New Script
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Stats */}
        <Analytics />

        {/* Main Dashboard Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
              <TabsTrigger 
                value="generator" 
                className="data-[state=active]:bg-electric-blue data-[state=active]:text-white"
              >
                Script Generator
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="data-[state=active]:bg-neon-pink data-[state=active]:text-white"
              >
                Saved Scripts
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="generator" className="mt-6">
              <ScriptGenerator />
            </TabsContent>
            
            <TabsContent value="saved" className="mt-6">
              <SavedScripts />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
}
