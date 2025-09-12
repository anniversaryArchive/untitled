import * as SQLite from "expo-sqlite";

import CommonTabledbInstance from "@/utils/sqlite";
import { TFolder } from "@/types/folder";

class TbFolder {
  #dbInstance: Promise<SQLite.SQLiteDatabase | null>;

  constructor() {
    this.#dbInstance = this.init();
  }

  private async init(): Promise<SQLite.SQLiteDatabase | null> {
    try {
      const inst = await CommonTabledbInstance.createDBInstance();

      if (inst) {
        await inst.runAsync(`
           CREATE TABLE IF NOT EXISTS folder (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
          );`);

        const firstRow = await inst.getFirstAsync("SELECT * FROM folder");

        if (firstRow === null) {
          await inst.runAsync("INSERT INTO folder (name) VALUES (?)", "기본 폴더");
        }
      }

      return inst;
    } catch (error) {
      console.error("TbFolder Init Error : ", error);
      return null;
    }
  }

  async create(name: string): Promise<any> {
    try {
      const db = await this.#dbInstance;
      if (!db) return null;

      const result = await db.runAsync("INSERT INTO folder (name) VALUES (?)", name);

      return !!result.changes;
    } catch (error) {
      console.error("TbFolder create Error : ", error);
      return null;
    }
  }

  async getAll(): Promise<TFolder[]> {
    const db = await this.#dbInstance;
    if (!db) return [];

    try {
      return await db.getAllAsync<TFolder>("SELECT * FROM folder ORDER BY created_at");
    } catch (error) {
      console.error("TbFolder getAll Error : ", error);
      return [];
    }
  }

  async getFolderById(id: TFolder["id"]): Promise<TFolder | null> {
    const db = await this.#dbInstance;
    if (!db) return null;

    try {
      return await db.getFirstAsync<TFolder>("SELECT * FROM folder WHERE id = ?", id);
    } catch (error) {
      console.error("TbFolder getOne Error : ", error);
      return null;
    }
  }

  async update(id: string, newname: string): Promise<boolean> {
    const db = await this.#dbInstance;
    if (!db) return false;

    try {
      const result = await db.runAsync("UPDATE folder SET name = ? WHERE id = ?", newname, id);
      return result.changes > 0;
    } catch (error) {
      console.error(`TbFolder update ${id} Error : ${error}`);
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    const db = await this.#dbInstance;
    if (!db) return false;

    try {
      const result = await db.runAsync("DELETE FROM folder WHERE id = ?", id);
      return result.changes > 0;
    } catch (error) {
      console.error(`TbFolder delete ${id} Error : ${error}`);
      return false;
    }
  }

  // 개발테스트 용
  async clear(): Promise<number | boolean> {
    const db = await this.#dbInstance;
    if (!db) return false;

    try {
      await db.execAsync(`
        DELETE FROM folder;
        UPDATE SQLITE_SEQUENCE SET seq = 0 WHERE name = 'folder';`);

      return true;
    } catch (error) {
      console.error(`TbFolder clear Error : ${error}`);
      return false;
    }
  }
}

export default new TbFolder();
