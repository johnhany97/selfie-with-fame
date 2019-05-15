import { openDB } from 'idb';

const SWF_DB_NAME = 'db_selfiewithfame';
const VERSION = 1;
// Stores
export const STORIES_STORE_NAME = 'store_stories';
export const EVENTS_STORE_NAME = 'store_events';

class DB {
  constructor() {
    DB.__dbPromise = openDB(SWF_DB_NAME, VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        const storiesStore = db.createObjectStore(STORIES_STORE_NAME, { keyPath: '_id', unique: true });
        storiesStore.createIndex('by-username', 'postedBy', { unique: false });

        const eventsStore = db.createObjectStore(EVENTS_STORE_NAME, { keyPath: '_id', unique: true });
      },
    });
  }

  static get = (store, index, key) => {
    DB.__dbPromise.then(db => db
      .transaction(store)
      .objectStore(store)
      .index(index)
      .getAll(key));
  }

  static getAllStories = () => DB.__dbPromise.then((db) => {
    const tx = db.transaction(STORIES_STORE_NAME, 'readonly');
    const store = tx.objectStore(STORIES_STORE_NAME);
    return store.getAll();
  });

  static getAllEvents = () => DB.__dbPromise.then((db) => {
    const tx = db.transaction(EVENTS_STORE_NAME, 'readonly');
    const store = tx.objectStore(EVENTS_STORE_NAME);
    return store.getAll();
  });

  static set = async (store, value) => DB.__dbPromise.then(async (db) => {
    const tx = db.transaction(store, 'readwrite');
    const s = tx.objectStore(store);
    await s.put(value);
    return tx.complete;
  })

  static delete = (store, key) => DB.__dbPromise.then((db) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).delete(key);
    tx.objectStore(store).getAll();
    return tx.complete;
  })
}

export default DB;
