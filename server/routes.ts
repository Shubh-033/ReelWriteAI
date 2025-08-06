import type { Express } from "express";
import { createServer, type Server } from "http";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { 
  loginSchema, 
  signupSchema, 
  scriptGenerationSchema,
  type ScriptGenerationData 
} from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT token
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
}

// Hugging Face AI integration
async function generateScriptWithAI(params: ScriptGenerationData): Promise<{
  hook: string;
  body: string;
  cta: string;
}> {
  const API_KEY = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_KEY || "hf_your_api_key";
  
  try {
    // Create a detailed prompt for the AI model
    const prompt = `Create an engaging social media script for ${params.contentType} in the ${params.niche} niche with a ${params.tone} tone, targeting ${params.length} content.

Additional context: ${params.notes || 'No additional requirements'}

Please structure the response as:
HOOK: [An attention-grabbing opening line that creates curiosity or addresses a pain point]
BODY: [Main content that provides value, tells a story, or shares insights - keep it engaging and conversational]
CTA: [A clear call-to-action that encourages engagement, follows, or specific action]

Make it unique, viral-worthy, and tailored to the ${params.niche} audience.`;

    const response = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-large", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 500,
          temperature: 0.8,
          repetition_penalty: 1.1
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const result = await response.json();
    const generatedText = result[0]?.generated_text || result.generated_text || "";
    
    // Parse the generated text to extract hook, body, and CTA
    const hookMatch = generatedText.match(/HOOK:\s*(.*?)(?=BODY:|$)/);
    const bodyMatch = generatedText.match(/BODY:\s*(.*?)(?=CTA:|$)/);
    const ctaMatch = generatedText.match(/CTA:\s*(.*?)$/);

    return {
      hook: hookMatch?.[1]?.trim() || generateFallbackHook(params),
      body: bodyMatch?.[1]?.trim() || generateFallbackBody(params),
      cta: ctaMatch?.[1]?.trim() || generateFallbackCTA(params)
    };
  } catch (error) {
    console.error('Hugging Face API error:', error);
    // Return fallback generated content
    return {
      hook: generateFallbackHook(params),
      body: generateFallbackBody(params),
      cta: generateFallbackCTA(params)
    };
  }
}

// Fallback generators with unique variations
function generateFallbackHook(params: ScriptGenerationData): string {
  const hooks = {
    "Fitness & Health": [
      "This 30-second morning routine will transform your energy levels forever",
      "I discovered the secret to burning calories while you sleep",
      "The fitness mistake 90% of people make (and how to fix it)",
      "This simple habit changed my body in 30 days"
    ],
    "Technology": [
      "This iPhone feature will change everything you know about productivity",
      "The tech secret that billionaires don't want you to discover",
      "I found the app that's replacing entire teams",
      "This coding trick will save you 10 hours per week"
    ],
    "Food & Cooking": [
      "The ingredient that makes restaurant food taste so good",
      "This 5-minute recipe went viral for a reason",
      "The cooking mistake that's ruining your meals",
      "Professional chefs hate this simple trick"
    ]
  };

  const nicheHooks = hooks[params.niche as keyof typeof hooks] || [
    "You won't believe what happened when I tried this",
    "This simple change transformed everything",
    "The secret that experts don't want you to know",
    "I couldn't believe the results after just one week"
  ];

  return nicheHooks[Math.floor(Math.random() * nicheHooks.length)];
}

function generateFallbackBody(params: ScriptGenerationData): string {
  const bodies = [
    "Here's what most people don't realize: success isn't about doing more, it's about doing the right things consistently. When I discovered this approach, everything changed. The results speak for themselves, and now I'm sharing exactly how you can do it too.",
    "The science behind this is fascinating. Researchers found that small, consistent actions compound over time to create massive results. I've been testing this method for months, and the transformation has been incredible.",
    "I used to struggle with the same challenges until I learned this game-changing strategy. Now, I wake up excited about my progress every single day. The best part? It only takes a few minutes to implement."
  ];

  return bodies[Math.floor(Math.random() * bodies.length)];
}

function generateFallbackCTA(params: ScriptGenerationData): string {
  const ctas = [
    "Save this post and try it tomorrow! Comment below with your results and follow for more tips that actually work.",
    "Double-tap if this helped you! Share with someone who needs to see this. What's your biggest challenge? Tell me in the comments!",
    "Follow for daily tips that will transform your life. Which tip are you going to try first? Let me know below!"
  ];

  return ctas[Math.floor(Math.random() * ctas.length)];
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = signupSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const existingUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );

      res.json({ 
        token, 
        user: { 
          id: user.id, 
          email: user.email, 
          username: user.username,
          fullName: user.fullName 
        } 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Signup failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );

      res.json({ 
        token, 
        user: { 
          id: user.id, 
          email: user.email, 
          username: user.username,
          fullName: user.fullName 
        } 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          username: user.username,
          fullName: user.fullName 
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user profile" });
    }
  });

  // Script generation routes
  app.post("/api/scripts/generate", authenticateToken, async (req: any, res) => {
    try {
      const validatedData = scriptGenerationSchema.parse(req.body);
      
      // Generate script using AI
      const generatedScript = await generateScriptWithAI(validatedData);
      
      res.json(generatedScript);
    } catch (error: any) {
      console.error('Script generation error:', error);
      res.status(500).json({ message: "Failed to generate script. Please try again." });
    }
  });

  app.post("/api/scripts/save", authenticateToken, async (req: any, res) => {
    try {
      const { title, niche, contentType, tone, length, notes, hook, body, cta } = req.body;
      
      if (!title || !niche || !contentType || !tone || !length || !hook || !body || !cta) {
        return res.status(400).json({ message: "Missing required script data" });
      }

      const script = await storage.createScript({
        userId: req.user.id,
        title,
        niche,
        contentType,
        tone,
        length,
        notes: notes || null,
        hook,
        body,
        cta,
        isFavorite: 0
      });

      res.json(script);
    } catch (error) {
      res.status(500).json({ message: "Failed to save script" });
    }
  });

  app.get("/api/scripts", authenticateToken, async (req: any, res) => {
    try {
      const scripts = await storage.getUserScripts(req.user.id);
      res.json(scripts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get scripts" });
    }
  });

  app.put("/api/scripts/:id", authenticateToken, async (req: any, res) => {
    try {
      const { id } = req.params;
      const script = await storage.getScript(id);
      
      if (!script || script.userId !== req.user.id) {
        return res.status(404).json({ message: "Script not found" });
      }

      const updatedScript = await storage.updateScript(id, req.body);
      res.json(updatedScript);
    } catch (error) {
      res.status(500).json({ message: "Failed to update script" });
    }
  });

  app.delete("/api/scripts/:id", authenticateToken, async (req: any, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteScript(id, req.user.id);
      
      if (!success) {
        return res.status(404).json({ message: "Script not found or unauthorized" });
      }

      res.json({ message: "Script deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete script" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/stats", authenticateToken, async (req: any, res) => {
    try {
      const stats = await storage.getUserStats(req.user.id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get analytics" });
    }
  });

  // Community routes
  app.get("/api/community/scripts", async (req, res) => {
    try {
      const communityScripts = await storage.getCommunityScripts();
      res.json(communityScripts.slice(0, 6)); // Return top 6 scripts
    } catch (error) {
      res.status(500).json({ message: "Failed to get community scripts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
