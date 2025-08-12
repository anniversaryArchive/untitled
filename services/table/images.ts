import uuid from "react-native-uuid";
import * as SQLite from "expo-sqlite";

import CommonTabledbInstance from "@/utils/sqlite";

import { TImage } from "@/types/image";

class TbImage {
  #dbInstance: Promise<SQLite.SQLiteDatabase | null>;

  constructor() {
    this.#dbInstance = this.init();
  }

  private async init(): Promise<SQLite.SQLiteDatabase | null> {
    try {
      const inst = await CommonTabledbInstance.createDBInstance();
      if (inst instanceof SQLite.SQLiteDatabase) {
        await inst.runAsync(`
           CREATE TABLE IF NOT EXISTS images (
            id TEXT PRIMARY KEY NOT NULL,
            path TEXT NOT NULL,
            created_at TEXT NOT NULL
          );`);
      }
      return inst;
    } catch (error) {
      console.error("TbImage Init Error : ", error);
      return null;
    }
  }

  async create(path: string): Promise<TImage | null> {
    try {
      const db = await this.#dbInstance;
      if (!db) return null;

      const id = uuid.v4();
      const now = new Date().toISOString();
      await db.runAsync(
        "INSERT INTO images (id, path, created_at) VALUES (?, ?, ?)",
        id,
        path,
        now
      );

      return { id, path, created_at: now };
    } catch (error) {
      console.error("TbImage create Error : ", error);
      return null;
    }
  }

  async getAll(): Promise<TImage[]> {
    const db = await this.#dbInstance;
    if (!db) return [];

    try {
      return await db.getAllAsync<TImage>("SELECT * FROM images ORDER BY created_at DESC");
    } catch (error) {
      console.error("TbImage getAll Error : ", error);
      return [];
    }
  }

  async getLastest(): Promise<TImage | null> {
    const db = await this.#dbInstance;
    if (!db) return null;

    try {
      return await db.getFirstAsync<TImage>("SELECT * FROM images ORDER BY created_at DESC");
    } catch (error) {
      console.error("TbImage getLastest Error : ", error);
      return null;
    }
  }

  async update(id: string, newPath: string): Promise<boolean> {
    const db = await this.#dbInstance;
    if (!db) return false;

    try {
      const result = await db.runAsync("UPDATE images SET path = ? WHERE id = ?", newPath, id);
      return result.changes > 0;
    } catch (error) {
      console.error(`TbImage update ${id} Error : ${error}`);
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    const db = await this.#dbInstance;
    if (!db) return false;

    try {
      const result = await db.runAsync("DELETE FROM images WHERE id = ?", id);
      return result.changes > 0;
    } catch (error) {
      console.error(`TbImage delete ${id} Error : ${error}`);
      return false;
    }
  }
}

export default new TbImage();
