import { toValue, ref } from "vue";
import type { Ref } from "vue";
import type { WordsList as List } from "../types/words";

export const useIndexedDB = () => {
  if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.");
  }

  const db: Ref<IDBDatabase | null> = ref(null);
  const recordsLength = ref(0);
  const filteredRecords: Ref<List> = ref([]);

  const getDb = (dbName = "list", version = 1) => new Promise((resolve, reject) => {
    if (db.value) {
      return resolve(db);
    }
    const request = window.indexedDB.open(dbName, version);

    request.onerror = (e) => {
      console.error(e);
      reject(e);
    };
    
    request.onsuccess = () => {
      db.value = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result;
      const objectStore = db.createObjectStore("list", { autoIncrement: true });
    }
  })

  getDb();

  const getRecordsLength = (): Promise<number> => new Promise(async (resolve) => {
    await getDb();
    if (!db.value) return;
    const transaction = db.value.transaction(["list"], "readonly");
    const objectStore = transaction.objectStore("list");

    const request = objectStore.count();
    request.onsuccess = () => {
      recordsLength.value = request.result;
      resolve(request.result);
    }
  })

  const addRecords = async (dataRef: Ref<List>) => new Promise(async (resolve) => {
    await getDb();
    if (!db.value) return;
    const transaction = db.value.transaction(["list"], "readwrite");
    const objectStore = transaction.objectStore("list");
    const data = toValue(dataRef);
    data.forEach((d, idx) => {
      const request = objectStore.add(d);
      if (idx === data.length - 1) request.onsuccess = () => {
        resolve(request.result);
      }
    });
  })

  const filterRecords = (str: string): Promise<List> => new Promise(async (resolve) => {
    await getDb();
    if (!db.value) return;
    filteredRecords.value = [];
    const transaction = db.value.transaction(["list"], "readonly");
    const objectStore = transaction.objectStore("list");
    const request = objectStore.openCursor();
    request.onsuccess = (e) => {
      let cursor = (e.target as IDBRequest).result;
			if (cursor) {
        if (cursor.value.startsWith(str)) filteredRecords.value.push(cursor.value);
				cursor.continue();
			} else {
        resolve(filteredRecords.value);
      }
    }
  })

  return {
    db,
    addRecords,
    getRecordsLength,
    getDb,
    recordsLength,
    filterRecords,
    filteredRecords
  }
}