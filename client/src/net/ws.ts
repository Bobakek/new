import { ClientMessage, ServerMessage, InputState } from "./messages";
import { World } from "../game/world";
import { Hud } from "../ui/hud";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws";

export class Net {
  private ws?: WebSocket;
  ping = 0;

  constructor(private world: World, private hud: Hud) {}

  connect(): Promise<void> {
    return new Promise((resolve) => {
      this.ws = new WebSocket(WS_URL);
      this.ws.onopen = () => {
        this.send({ type: "Join", name: "Hero" + Math.floor(Math.random() * 1000) });
        resolve();
      };
      this.ws.onmessage = (e) => this.handle(e);
    });
  }

  private handle(e: MessageEvent) {
    const msg = JSON.parse(e.data) as ServerMessage;
    switch (msg.type) {
      case "State":
        msg.players.forEach((p) => this.world.updatePlayer(p, p.id === msg.you));
        break;
      case "Chat":
        this.hud.addChat(msg.id, msg.text);
        break;
    }
  }

  sendInput(input: InputState) {
    this.send({ type: "Input", input });
  }

  sendChat(text: string) {
    this.send({ type: "Chat", text });
  }

  private send(msg: ClientMessage) {
    this.ws?.send(JSON.stringify(msg));
  }
}
