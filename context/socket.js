import io from "socket.io-client";
import React from "react";

function connectToSocket(is_connect) {
  const socket = is_connect
    ? io.connect("https://nextinstaserver.herokuapp.com", {
        transports: ["websocket"],
      })
    : null;
  return socket;
}
export default connectToSocket;
export const SocketContext = React.createContext();
