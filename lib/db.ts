import { Collection, Db, MongoClient, Document } from "mongodb";
import clientPromise from "./mongodb";
import { User, EventData, Participant, CheckIn } from "./types";

export class Database {
  private static instance: Database;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<Db> {
    if (this.db) return this.db;

    this.client = await clientPromise;
    this.db = this.client.db("eventsphere");
    return this.db;
  }

  async getCollection<T extends Document = Document>(
    name: string,
  ): Promise<Collection<T>> {
    const db = await this.connect();
    return db.collection<T>(name);
  }

  // User collections
  async users(): Promise<Collection<User>> {
    return this.getCollection<User>("users");
  }

  // Event collections
  async events(): Promise<Collection<EventData>> {
    return this.getCollection<EventData>("events");
  }

  // Participant collections
  async participants(): Promise<Collection<Participant>> {
    return this.getCollection<Participant>("participants");
  }

  // Check-in collections
  async checkIns(): Promise<Collection<CheckIn>> {
    return this.getCollection<CheckIn>("checkins");
  }
}

export const db = Database.getInstance();
