import * as BABYLON from "babylonjs";
import { createScene } from "./game/scene";
import { World } from "./game/world";
import { Hud } from "./ui/hud";
import { Net } from "./net/ws";
import { Input } from "./game/input";

async function start() {
  const canvas = document.getElementById("game") as HTMLCanvasElement;
  const engine = new BABYLON.Engine(canvas, true);
  const scene = createScene(engine);
  const world = new World(scene);
  const hud = new Hud();
  const net = new Net(world, hud);

  await net.connect();
  new Input(net, world);

  engine.runRenderLoop(() => {
    const dt = engine.getDeltaTime() / 1000;
    world.update(dt);
    scene.render();
    hud.setStats(engine.getFps(), net.ping);
  });

  window.addEventListener("resize", () => engine.resize());
}
start();
