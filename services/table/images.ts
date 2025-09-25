import * as SQLite from "expo-sqlite";

import CommonTabledbInstance from "@/utils/sqlite";

import { TImage } from "@/types/image";

class TbImages {
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
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            assetId TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
          );`);
      }
      return inst;
    } catch (error) {
      console.error("TbImages Init Error : ", error);
      return null;
    }
  }

  async create(assetId: string): Promise<boolean> {
    try {
      const db = await this.#dbInstance;
      if (!db) return false;

      const res = await db.runAsync("INSERT INTO images (assetId) VALUES (?)", assetId);

      return !!res.changes;
    } catch (error) {
      console.error("TbImages create Error : ", error);
      return false;
    }
  }

  async getAll(): Promise<TImage[]> {
    const db = await this.#dbInstance;
    if (!db) return [];

    try {
      return await db.getAllAsync<TImage>("SELECT * FROM images ORDER BY created_at DESC");
    } catch (error) {
      console.error("TbImages getAll Error : ", error);
      return [];
    }
  }

  async getLastest(): Promise<TImage | null> {
    const db = await this.#dbInstance;
    if (!db) return null;

    try {
      return await db.getFirstAsync<TImage>("SELECT * FROM images ORDER BY created_at DESC");
    } catch (error) {
      console.error("TbImages getLastest Error : ", error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    const db = await this.#dbInstance;
    if (!db) return false;

    try {
      const result = await db.runAsync("DELETE FROM images WHERE id = ?", id);
      return result.changes > 0;
    } catch (error) {
      console.error(`TbImages delete ${id} Error : ${error}`);
      return false;
    }
  }

  async deleteByAssetId(assetId: string): Promise<boolean> {
    const db = await this.#dbInstance;
    if (!db) return false;

    try {
      const result = await db.runAsync("DELETE FROM images WHERE assetId = ?", assetId);
      return result.changes > 0;
    } catch (error) {
      console.error(`TbImages deleteByAssetId ${assetId} Error : ${error}`);
      return false;
    }
  }
}

export default new TbImages();
