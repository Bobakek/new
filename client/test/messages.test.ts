import { describe, it, expect } from "vitest";
import { ClientMessage } from "../src/net/messages";

describe("messages serialization", () => {
  it("Chat message roundtrip", () => {
    const msg: ClientMessage = { type: "Chat", text: "hi" };
    const json = JSON.stringify(msg);
    const parsed = JSON.parse(json) as ClientMessage;
    expect(parsed).toEqual(msg);
  });
});
