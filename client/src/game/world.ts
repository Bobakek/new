import * as BABYLON from "babylonjs";
import { Entity, createEntity } from "../ecs/entity";
import { Transform } from "../ecs/components/transform";
import { Player } from "../ecs/components/player";
import { MovementSystem } from "../ecs/systems/movement";
import { PlayerState, InputState } from "../net/messages";
import { createPlayerMesh } from "./player";

export class World {
  scene: BABYLON.Scene;
  transforms = new Map<Entity, Transform>();
  players = new Map<Entity, Player>();
  movement = new MovementSystem(this.transforms);
  local?: Entity;

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  spawnPlayer(id: string, name: string, isLocal: boolean, pos: BABYLON.Vector3) {
    const e = createEntity();
    const mesh = createPlayerMesh(`p-${id}`, this.scene);
    mesh.position.copyFrom(pos);
    this.transforms.set(e, { mesh, target: pos.clone() });
    this.players.set(e, { id, name, isLocal });
    if (isLocal) {
      this.local = e;
      (this.scene.activeCamera as BABYLON.ArcRotateCamera).target = mesh.position;
    }
    return e;
  }

  updatePlayer(state: PlayerState, isLocal: boolean) {
    let entity = [...this.players.entries()].find(([, p]) => p.id === state.id)?.[0];
    const pos = new BABYLON.Vector3(state.x, state.y, state.z);
    if (!entity) {
      entity = this.spawnPlayer(state.id, state.name, isLocal, pos);
      return;
    }
    const t = this.transforms.get(entity);
    if (!t) return;
    if (isLocal) {
      t.mesh.position.copyFrom(pos);
      t.target.copyFrom(pos);
    } else {
      t.target.copyFrom(pos);
    }
  }

  applyLocalInput(input: InputState) {
    if (this.local === undefined) return;
    const t = this.transforms.get(this.local);
    if (!t) return;
    const speed = 0.1;
    const dir = new BABYLON.Vector3(
      (input.right ? 1 : 0) - (input.left ? 1 : 0),
      0,
      (input.forward ? 1 : 0) - (input.backward ? 1 : 0)
    );
    if (dir.lengthSquared() > 0) {
      dir.normalize().scaleInPlace(speed);
      t.mesh.moveWithCollisions(dir);
      t.target.copyFrom(t.mesh.position);
    }
  }

  update(dt: number) {
    this.movement.update(dt);
  }
}
