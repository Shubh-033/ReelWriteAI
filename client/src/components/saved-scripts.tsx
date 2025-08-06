import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, RotateCcw, Trash2, Search, Filter, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Script } from "@shared/schema";

export default function SavedScripts() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { token } = useAuth();

  const { data: scripts = [], isLoading } = useQuery<Script[]>({
    queryKey: ['/api/scripts'],
    enabled: !!token,
  });

  const deleteScriptMutation = useMutation({
    mutationFn: async (scriptId: string) => {
      return apiRequest('DELETE', `/api/scripts/${scriptId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scripts'] });
      toast({
        title: "Script deleted",
        description: "Script has been removed from your collection.",
      });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Unable to delete script. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ id, isFavorite }: { id: string; isFavorite: number }) => {
      return apiRequest('PUT', `/api/scripts/${id}`, { 
        isFavorite: isFavorite === 1 ? 0 : 1 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scripts'] });
    },
  });

  const filteredScripts = scripts.filter(script =>
    script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    script.niche.toLowerCase().includes(searchTerm.toLowerCase()) ||
    script.contentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = async (script: Script) => {
    const fullScript = `HOOK: ${script.hook}\n\nBODY: ${script.body}\n\nCTA: ${script.cta}`;
    
    try {
      await navigator.clipboard.writeText(fullScript);
      toast({
        title: "Copied!",
        description: "Script copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please try copying manually.",
        variant: "destructive",
      });
    }
  };

  const getBadgeColor = (niche: string) => {
    const colors: { [key: string]: string } = {
      'Fitness & Health': 'bg-green-100 text-green-800',
      'Technology': 'bg-blue-100 text-blue-800',
      'Food & Cooking': 'bg-yellow-100 text-yellow-800',
      'Travel': 'bg-purple-100 text-purple-800',
      'Fashion & Beauty': 'bg-pink-100 text-pink-800',
      'Business & Finance': 'bg-gray-100 text-gray-800',
      'Entertainment': 'bg-red-100 text-red-800',
      'Education': 'bg-indigo-100 text-indigo-800',
    };
    return colors[niche] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-sm p-8"
      >
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2 flex-1">
                  <div className="flex space-x-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl shadow-sm p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Saved Scripts</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search scripts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-1 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>
      
      {filteredScripts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {scripts.length === 0 ? "No saved scripts yet" : "No scripts found"}
          </h3>
          <p className="text-gray-600 mb-6">
            {scripts.length === 0 
              ? "Generate your first AI script to get started!" 
              : "Try adjusting your search terms."
            }
          </p>
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {filteredScripts.map((script, index) => (
            <motion.div
              key={script.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getBadgeColor(script.niche)}>
                          {script.niche}
                        </Badge>
                        <Badge variant="secondary">
                          {script.contentType}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(script.createdAt).toLocaleDateString()}
                        </span>
                        {script.isFavorite === 1 && (
                          <Heart className="w-4 h-4 text-red-500 fill-current" />
                        )}
                      </div>
                      <h3 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                        {script.title}
                      </h3>
                    </div>
                    <div className="flex space-x-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavoriteMutation.mutate({ 
                            id: script.id, 
                            isFavorite: script.isFavorite 
                          })}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Heart 
                            className={`h-4 w-4 ${script.isFavorite === 1 ? 'fill-current text-red-500' : ''}`} 
                          />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(script)}
                          className="text-gray-400 hover:text-electric-blue transition-colors"
                          title="Copy"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteScriptMutation.mutate(script.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                          disabled={deleteScriptMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium electric-blue mb-1">Hook:</div>
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {script.hook}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium neon-pink mb-1">Body:</div>
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {script.body}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium lime-green mb-1">CTA:</div>
                      <div className="text-sm text-gray-600 line-clamp-1">
                        {script.cta}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
