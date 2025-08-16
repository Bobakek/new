export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

export interface PlayerState {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
}

export interface JoinMessage {
  type: "Join";
  name: string;
}
export interface InputMessage {
  type: "Input";
  input: InputState;
}
export interface ChatMessageC2S {
  type: "Chat";
  text: string;
}

export interface StateMessage {
  type: "State";
  you: string;
  players: PlayerState[];
}
export interface ChatMessageS2C {
  type: "Chat";
  id: string;
  text: string;
}

export type ClientMessage = JoinMessage | InputMessage | ChatMessageC2S;
export type ServerMessage = StateMessage | ChatMessageS2C;
