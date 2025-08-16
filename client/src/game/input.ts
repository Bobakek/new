import { Net } from "../net/ws";
import { World } from "./world";
import { InputState } from "../net/messages";

export class Input {
  private keys: Record<string, boolean> = {};

  constructor(private net: Net, private world: World) {
    window.addEventListener("keydown", (e) => (this.keys[e.code] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.code] = false));
    setInterval(() => this.tick(), 50); // 20 ticks
  }

  private tick() {
    const input: InputState = {
      forward: !!this.keys["KeyW"],
      backward: !!this.keys["KeyS"],
      left: !!this.keys["KeyA"],
      right: !!this.keys["KeyD"]
    };
    this.net.sendInput(input);
    this.world.applyLocalInput(input);
  }
}
