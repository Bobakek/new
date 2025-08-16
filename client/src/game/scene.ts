import * as BABYLON from "babylonjs";

export function createScene(engine: BABYLON.Engine): BABYLON.Scene {
  const scene = new BABYLON.Scene(engine);
  new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  const camera = new BABYLON.ArcRotateCamera(
    "cam",
    Math.PI / 2,
    Math.PI / 3,
    10,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera.attachControl(engine.getRenderingCanvas(), true);

  BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);

  return scene;
}
