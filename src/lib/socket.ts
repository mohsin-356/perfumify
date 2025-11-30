import type { Server as IOServer } from "socket.io";

declare global {
  var _io: IOServer | undefined;
}

export function getIO() {
  return global._io;
}

export function setIO(io: IOServer) {
  global._io = io;
}
