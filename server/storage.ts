import { type User, type InsertUser, type Script, type InsertScript, type CommunityScript } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Script operations
  createScript(script: InsertScript): Promise<Script>;
  getScript(id: string): Promise<Script | undefined>;
  getUserScripts(userId: string): Promise<Script[]>;
  updateScript(id: string, updates: Partial<Script>): Promise<Script | undefined>;
  deleteScript(id: string, userId: string): Promise<boolean>;
  
  // Community operations
  getCommunityScripts(): Promise<(CommunityScript & { script: Script })[]>;
  addToCommunity(scriptId: string, anonymousUsername: string): Promise<void>;
  
  // Analytics
  getUserStats(userId: string): Promise<{
    totalScripts: number;
    weeklyScripts: number;
    favoriteScripts: number;
    successRate: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private scripts: Map<string, Script>;
  private communityScripts: Map<string, CommunityScript>;

  constructor() {
    this.users = new Map();
    this.scripts = new Map();
    this.communityScripts = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async createScript(insertScript: InsertScript): Promise<Script> {
    const id = randomUUID();
    const now = new Date();
    const script: Script = { 
      ...insertScript,
      notes: insertScript.notes || null,
      isFavorite: insertScript.isFavorite || 0,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.scripts.set(id, script);
    return script;
  }

  async getScript(id: string): Promise<Script | undefined> {
    return this.scripts.get(id);
  }

  async getUserScripts(userId: string): Promise<Script[]> {
    return Array.from(this.scripts.values())
      .filter(script => script.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateScript(id: string, updates: Partial<Script>): Promise<Script | undefined> {
    const script = this.scripts.get(id);
    if (!script) return undefined;
    
    const updatedScript = { 
      ...script, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.scripts.set(id, updatedScript);
    return updatedScript;
  }

  async deleteScript(id: string, userId: string): Promise<boolean> {
    const script = this.scripts.get(id);
    if (!script || script.userId !== userId) return false;
    
    this.scripts.delete(id);
    // Also remove from community if it exists
    Array.from(this.communityScripts.entries()).forEach(([communityId, communityScript]) => {
      if (communityScript.scriptId === id) {
        this.communityScripts.delete(communityId);
      }
    });
    return true;
  }

  async getCommunityScripts(): Promise<(CommunityScript & { script: Script })[]> {
    const results: (CommunityScript & { script: Script })[] = [];
    
    Array.from(this.communityScripts.values()).forEach(communityScript => {
      if (communityScript.isVisible) {
        const script = this.scripts.get(communityScript.scriptId);
        if (script) {
          results.push({ ...communityScript, script });
        }
      }
    });
    
    return results.sort((a, b) => b.likes - a.likes);
  }

  async addToCommunity(scriptId: string, anonymousUsername: string): Promise<void> {
    const id = randomUUID();
    const communityScript: CommunityScript = {
      id,
      scriptId,
      anonymousUsername,
      likes: Math.floor(Math.random() * 500) + 100,
      shares: Math.floor(Math.random() * 100) + 20,
      isVisible: 1,
      createdAt: new Date()
    };
    this.communityScripts.set(id, communityScript);
  }

  async getUserStats(userId: string): Promise<{
    totalScripts: number;
    weeklyScripts: number;
    favoriteScripts: number;
    successRate: number;
  }> {
    const userScripts = Array.from(this.scripts.values())
      .filter(script => script.userId === userId);
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyScripts = userScripts.filter(
      script => script.createdAt >= oneWeekAgo
    ).length;
    
    const favoriteScripts = userScripts.filter(
      script => script.isFavorite === 1
    ).length;

    return {
      totalScripts: userScripts.length,
      weeklyScripts,
      favoriteScripts,
      successRate: userScripts.length > 0 ? Math.min(95, 85 + (userScripts.length * 2)) : 0
    };
  }
}

export const storage = new MemStorage();
