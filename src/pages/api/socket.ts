import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";
import { setIO } from "@/lib/socket";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  // @ts-ignore
  if (!res.socket.server.io) {
    // @ts-ignore
    const io = new Server(res.socket.server, {
      path: "/api/socket_io",
      addTrailingSlash: false,
      cors: { origin: "*" },
    });
    // @ts-ignore
    res.socket.server.io = io;
    setIO(io);

    io.on("connection", (socket: any) => {
      socket.on("join", (room: string) => {
        socket.join(room);
      });
    });
  }
  res.end();
}
