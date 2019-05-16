import socketIOClient from 'socket.io-client';

export const SOCKET_IO_ENDPOINT = 'https://localhost:3001';
// Events - Stuff we listen for
export const EVENT_CONNECT = 'connect'; // On Connection, contains within it all things we want to do then
export const EVENT_NEW_STORY = 'new_story'; // Custom event, to inform us that there is an update on the timeline front
// Emit Events - Stuff we send
export const EMIT_EVENT_CONNECTED = 'connected'; // Custom event, to inform server that username X is connected
export const EMIT_EVENT_POST_STORY = 'post_story'; // Custom event, to post a story that was waiting for us to be online

class IO {
  static setup() {
    if (!IO.socket) {
      IO.socket = socketIOClient(SOCKET_IO_ENDPOINT, {
        reconnection: true,
        secure: true,
      });
    }
  }

  static attachToEvent = (event, fn) => {
    IO.setup();
    // Clear all existing ones
    IO.socket.removeAllListeners(event);
    // Attach new one
    IO.socket.on(event, fn);
  }

  static removeAllListenersForEvent = (event) => {
    IO.setup();
    IO.socket.removeAllListeners(event);
  }

  static emit = (event, data) => {
    IO.setup();
    IO.socket.emit(event, data);
  }
}

export default IO;
