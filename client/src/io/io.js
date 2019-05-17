/* eslint-disable no-underscore-dangle */
import socketIOClient from 'socket.io-client';

import DB, { OFFLINE_STORIES_STORE_NAME, EVENTS_STORE_NAME, STORIES_STORE_NAME } from '../db/db';

export const SOCKET_IO_ENDPOINT = 'https://localhost:3001';
// Events - Stuff we listen for
export const EVENT_CONNECT = 'connect'; // On Connection, contains within it all things we want to do then
export const EVENT_NEW_STORY = 'new_story'; // Custom event, to inform us that there is an update on the timeline front
export const EVENT_RECEIVE_EVENTS = 'receive_events'; // Custom event, to allow us to update local idb events store
export const EVENT_RECEIVE_STORIES = 'receive_stories'; // Custom event to allow us to update local idb stories store
// Emit Events - Stuff we send
export const EMIT_EVENT_CONNECTED = 'connected'; // Custom event, to inform server that username X is connected
export const EMIT_EVENT_POST_STORY = 'post_story'; // Custom event, to post a story that was waiting for us to be online
export const EMIT_EVENT_REQUEST_STORIES = 'request_stories'; // Custom event, to request an update to idb stories store
export const EMIT_EVENT_REQUEST_EVENTS = 'request_events'; // Custom event, to request an update to idb events store
export const EMIT_EVENT_REQUEST_NEWS_FEED = 'request_news_feed'; // Custom event, to request an update to news feed store

class IO {
  static setup(username) {
    IO.socket = socketIOClient(SOCKET_IO_ENDPOINT, {
      reconnection: true,
      secure: true,
    });
    IO.attachToEvent(EVENT_CONNECT, async () => {
      IO.emit(EMIT_EVENT_CONNECTED, username);
      // Post offline-posted stories
      // Check if any data in IDB offline stories store
      const stories = await DB.getOfflineStories();
      if (stories) {
        for (let i = 0; i < stories.length; i += 1) {
          const story = {
            text: stories[i].text,
            event_id: stories[i].event._id,
            pictures: stories[i].pictures,
            username,
          };
          IO.emit(EMIT_EVENT_POST_STORY, story);
          DB.delete(OFFLINE_STORIES_STORE_NAME, stories[i].id);
        }
      }
      // Sync up stories store
      IO.emit(EMIT_EVENT_REQUEST_STORIES, username);
      // Sync up events store
      IO.emit(EMIT_EVENT_REQUEST_EVENTS, username);
    });
    // Handle receiving updates to the events store
    IO.attachToEvent(EVENT_RECEIVE_EVENTS, (events) => {
      events.forEach(event => DB.set(EVENTS_STORE_NAME, event));
    });
    // Handle receiving updates to the stories store
    IO.attachToEvent(EVENT_RECEIVE_STORIES, (stories) => {
      stories.forEach(story => DB.set(STORIES_STORE_NAME, story));
    });
  }

  static attachToEvent = (event, fn) => {
    // Clear all existing ones
    IO.socket.removeAllListeners(event);
    // Attach new one
    IO.socket.on(event, fn);
  }

  static removeAllListenersForEvent = (event) => {
    IO.socket.removeAllListeners(event);
  }

  static emit = (event, data) => {
    IO.socket.emit(event, data);
  }
}

export default IO;
