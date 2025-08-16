import * as BABYLON from "babylonjs";

export function createPlayerMesh(id: string, scene: BABYLON.Scene): BABYLON.Mesh {
  return BABYLON.MeshBuilder.CreateCapsule(id, { height: 2 }, scene);
}
