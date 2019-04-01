import { openDB } from 'idb';

const SWF_DB_NAME = 'db_selfiewithfame';
const VERSION = 7;
// Stores
export const STORIES_STORE_NAME = 'store_stories';

class DB {
  constructor() {
    this.dbPromise = openDB(SWF_DB_NAME, VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        const storiesStore = db.createObjectStore(STORIES_STORE_NAME, { keyPath: 'id', autoIncrement: true });
        storiesStore.createIndex('postedBy', 'postedBy', { unique: false });
        storiesStore.createIndex('text', 'text', { unique: false });
        storiesStore.createIndex('picture', 'picture', { unique: false });
        storiesStore.createIndex('createdAt', 'createdAt', { unique: false });
        storiesStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      },
    });
  }

  get = (store, index, key) => {
    this.dbPromise.then(db => db
      .transaction(store)
      .objectStore(store)
      .index(index)
      .getAll(key));
  }

  getAllStories = () => this.dbPromise.then((db) => {
    const tx = db.transaction(STORIES_STORE_NAME, 'readonly');
    const store = tx.objectStore(STORIES_STORE_NAME);
    return store.getAll();
  });

  set = async (store, value) => this.dbPromise.then(async (db) => {
    const tx = db.transaction(store, 'readwrite');
    const s = tx.objectStore(store);
    await s.put(value);
    return tx.complete;
  })

  delete = (store, key) => this.dbPromise.then((db) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).delete(key);
    tx.objectStore(store).getAll();
    return tx.complete;
  })
}

export default DB;
