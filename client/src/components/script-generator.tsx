import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WandSparkles, Copy, Save, RotateCcw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { generateScript, saveScript } from "@/lib/huggingface";
import { scriptGenerationSchema, type ScriptGenerationData } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

interface GeneratedScript {
  hook: string;
  body: string;
  cta: string;
}

export default function ScriptGenerator() {
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { token } = useAuth();

  const form = useForm<ScriptGenerationData>({
    resolver: zodResolver(scriptGenerationSchema),
    defaultValues: {
      niche: "",
      contentType: "",
      tone: "",
      length: "",
      notes: "",
    },
  });

  const onGenerate = async (data: ScriptGenerationData) => {
    if (!token) return;
    
    setIsGenerating(true);
    try {
      const script = await generateScript(data, token);
      setGeneratedScript(script);
      toast({
        title: "Script generated!",
        description: "Your AI-powered script is ready to use.",
      });
    } catch (error: any) {
      toast({
        title: "Generation failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    const currentData = form.getValues();
    onGenerate(currentData);
  };

  const handleCopy = async () => {
    if (!generatedScript) return;
    
    const fullScript = `HOOK: ${generatedScript.hook}\n\nBODY: ${generatedScript.body}\n\nCTA: ${generatedScript.cta}`;
    
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

  const handleSave = async () => {
    if (!generatedScript || !token) return;
    
    const formData = form.getValues();
    const title = `${formData.niche} ${formData.contentType} Script`;
    
    setIsSaving(true);
    try {
      await saveScript({
        title,
        ...formData,
        ...generatedScript,
      }, token);
      
      // Invalidate scripts query to refresh the saved scripts list
      queryClient.invalidateQueries({ queryKey: ['/api/scripts'] });
      
      toast({
        title: "Script saved!",
        description: "Added to your saved scripts.",
      });
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl shadow-sm p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">AI Script Generator</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-lime-green rounded-full animate-pulse"></div>
          <span>AI Ready</span>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onGenerate)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="niche"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Niche</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a niche" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Fitness & Health">Fitness & Health</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Food & Cooking">Food & Cooking</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Fashion & Beauty">Fashion & Beauty</SelectItem>
                      <SelectItem value="Business & Finance">Business & Finance</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Instagram Reel">Instagram Reel</SelectItem>
                      <SelectItem value="TikTok Video">TikTok Video</SelectItem>
                      <SelectItem value="YouTube Short">YouTube Short</SelectItem>
                      <SelectItem value="Facebook Post">Facebook Post</SelectItem>
                      <SelectItem value="LinkedIn Post">LinkedIn Post</SelectItem>
                      <SelectItem value="Twitter Thread">Twitter Thread</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tone & Style</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Casual & Friendly">Casual & Friendly</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Humorous">Humorous</SelectItem>
                      <SelectItem value="Inspirational">Inspirational</SelectItem>
                      <SelectItem value="Educational">Educational</SelectItem>
                      <SelectItem value="Dramatic">Dramatic</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Script Length</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Short (15-30 seconds)">Short (15-30 seconds)</SelectItem>
                      <SelectItem value="Medium (30-60 seconds)">Medium (30-60 seconds)</SelectItem>
                      <SelectItem value="Long (60+ seconds)">Long (60+ seconds)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any specific requirements or topics you want to include..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="submit" 
              disabled={isGenerating}
              className="gradient-bg text-white px-8 py-4 text-lg font-semibold hover:shadow-xl transition-all duration-300 w-full md:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Script...
                </>
              ) : (
                <>
                  <WandSparkles className="mr-2 h-5 w-5" />
                  Generate Script with AI
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </Form>
      
      {/* Generated Script Display */}
      {generatedScript && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-electric-blue/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Generated Script
                </CardTitle>
                <div className="flex space-x-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleRegenerate}
                      disabled={isGenerating}
                      variant="outline"
                      size="sm"
                      className="bg-neon-pink text-white border-neon-pink hover:bg-neon-pink/90"
                    >
                      <RotateCcw className="mr-1 h-4 w-4" />
                      Regenerate
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      size="sm"
                      className="bg-lime-green text-white border-lime-green hover:bg-lime-green/90"
                    >
                      <Copy className="mr-1 h-4 w-4" />
                      Copy
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      variant="outline"
                      size="sm"
                      className="bg-electric-blue text-white border-electric-blue hover:bg-electric-blue/90"
                    >
                      {isSaving ? (
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-1 h-4 w-4" />
                      )}
                      Save
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div 
                className="bg-white rounded-lg p-4"
                whileHover={{ scale: 1.01 }}
              >
                <div className="text-sm font-medium electric-blue mb-2">🎣 HOOK</div>
                <div className="text-gray-800">{generatedScript.hook}</div>
              </motion.div>
              
              <Separator />
              
              <motion.div 
                className="bg-white rounded-lg p-4"
                whileHover={{ scale: 1.01 }}
              >
                <div className="text-sm font-medium neon-pink mb-2">📝 BODY</div>
                <div className="text-gray-800">{generatedScript.body}</div>
              </motion.div>
              
              <Separator />
              
              <motion.div 
                className="bg-white rounded-lg p-4"
                whileHover={{ scale: 1.01 }}
              >
                <div className="text-sm font-medium lime-green mb-2">🚀 CALL TO ACTION</div>
                <div className="text-gray-800">{generatedScript.cta}</div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
