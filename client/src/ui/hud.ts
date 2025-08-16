export class Hud {
  private log = document.getElementById("log")!;
  private chat = document.getElementById("chat")!;

  addChat(id: string, text: string) {
    const div = document.createElement("div");
    div.textContent = `${id}: ${text}`;
    this.chat.appendChild(div);
  }

  setStats(fps: number, ping: number) {
    this.log.textContent = `FPS: ${fps.toFixed(0)} Ping: ${ping.toFixed(0)}ms`;
  }
}
