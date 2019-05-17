import { openDB } from 'idb';

const SWF_DB_NAME = 'db_selfiewithfame';
const VERSION = 1;
// Stores
export const STORIES_STORE_NAME = 'store_stories';
export const EVENTS_STORE_NAME = 'store_events';
// Offline stores
export const OFFLINE_STORIES_STORE_NAME = 'store_offline_stories';

class DB {
  constructor() {
    DB.dbPromise = openDB(SWF_DB_NAME, VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        const storiesStore = db.createObjectStore(STORIES_STORE_NAME, { keyPath: '_id', unique: true });
        storiesStore.createIndex('by-username', 'postedBy', { unique: false });

        // eslint-disable-next-line no-unused-vars
        const eventsStore = db.createObjectStore(EVENTS_STORE_NAME, { keyPath: '_id', unique: true });

        // eslint-disable-next-line no-unused-vars
        const offlineStoriesStore = db.createObjectStore(OFFLINE_STORIES_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      },
    });
  }

  static get = (store, index, key) => {
    DB.dbPromise.then(db => db
      .transaction(store)
      .objectStore(store)
      .index(index)
      .getAll(key));
  }

  static getAllStories = () => DB.dbPromise.then((db) => {
    const tx = db.transaction(STORIES_STORE_NAME, 'readonly');
    const store = tx.objectStore(STORIES_STORE_NAME);
    return store.getAll();
  });

  static getOfflineStories = () => DB.dbPromise.then((db) => {
    const tx = db.transaction(OFFLINE_STORIES_STORE_NAME, 'readonly');
    const store = tx.objectStore(OFFLINE_STORIES_STORE_NAME);
    return store.getAll();
  });

  static getAllEvents = () => DB.dbPromise.then((db) => {
    const tx = db.transaction(EVENTS_STORE_NAME, 'readonly');
    const store = tx.objectStore(EVENTS_STORE_NAME);
    return store.getAll();
  });

  static set = async (store, value) => DB.dbPromise.then(async (db) => {
    const tx = db.transaction(store, 'readwrite');
    const s = tx.objectStore(store);
    await s.put(value);
    return tx.complete;
  })

  static delete = (store, key) => DB.dbPromise.then((db) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).delete(key);
    tx.objectStore(store).getAll();
    return tx.complete;
  })
}

export default DB;
