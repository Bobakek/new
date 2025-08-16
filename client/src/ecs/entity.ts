export type Entity = number;
let next = 1;
export function createEntity(): Entity {
  return next++;
}
