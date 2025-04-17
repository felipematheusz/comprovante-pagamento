import { LocationData } from "../actions/location";

const DB_NAME = "locationDB";
const DB_VERSION = 1;
const STORE_NAME = "locations";

export class IndexedDBService {
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject("Erro ao abrir o banco de dados");
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "timestamp" });
        }
      };
    });
  }

  async saveLocation(location: LocationData): Promise<void> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      const locationWithTimestamp = {
        ...location,
        timestamp: new Date().getTime(),
      };

      const request = store.add(locationWithTimestamp);

      request.onsuccess = () => resolve();
      request.onerror = () => reject("Erro ao salvar localização");
    });
  }

  async getLocations(): Promise<(LocationData & { timestamp: number })[]> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject("Erro ao buscar localizações");
    });
  }
} 