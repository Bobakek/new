import * as BABYLON from "babylonjs";
import { Transform } from "../components/transform";

export class MovementSystem {
  constructor(private transforms: Map<number, Transform>) {}

  update(dt: number) {
    this.transforms.forEach((t) => {
      t.mesh.position = BABYLON.Vector3.Lerp(
        t.mesh.position,
        t.target,
        Math.min(1, dt * 10)
      );
    });
  }
}
