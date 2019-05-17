/* eslint-disable no-underscore-dangle */
import socketIOClient from 'socket.io-client';

import DB, { OFFLINE_STORIES_STORE_NAME } from '../db/db';

export const SOCKET_IO_ENDPOINT = 'https://localhost:3001';
// Events - Stuff we listen for
export const EVENT_CONNECT = 'connect'; // On Connection, contains within it all things we want to do then
export const EVENT_NEW_STORY = 'new_story'; // Custom event, to inform us that there is an update on the timeline front
// Emit Events - Stuff we send
export const EMIT_EVENT_CONNECTED = 'connected'; // Custom event, to inform server that username X is connected
export const EMIT_EVENT_POST_STORY = 'post_story'; // Custom event, to post a story that was waiting for us to be online

class IO {
  static setup(username) {
    IO.socket = socketIOClient(SOCKET_IO_ENDPOINT, {
      reconnection: true,
      secure: true,
    });
    IO.attachToEvent(EVENT_CONNECT, async () => {
      console.log(username);
      IO.emit(EMIT_EVENT_CONNECTED, username);
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
