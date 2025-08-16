package main

import (
    "fmt"
    "math"
    "math/rand"

    "github.com/gorilla/websocket"
)

type Vec3 struct{ X, Y, Z float64 }

type Player struct {
    id    string
    name  string
    conn  *websocket.Conn
    room  *Room
    send  chan interface{}
    pos   Vec3
    input InputState
}

func NewPlayer(conn *websocket.Conn, room *Room) *Player {
    p := &Player{
        id:   fmt.Sprintf("%06d", rand.Intn(1_000_000)),
        conn: conn,
        room: room,
        send: make(chan interface{}, 16),
    }
    go p.readLoop()
    go p.writeLoop()
    room.add <- p
    return p
}

func (p *Player) readLoop() {
    defer func() {
        p.room.remove <- p
        p.conn.Close()
    }()
    for {
        var msg map[string]interface{}
        if err := p.conn.ReadJSON(&msg); err != nil {
            return
        }
        switch msg["type"] {
        case "Join":
            p.name = msg["name"].(string)
        case "Input":
            input := msg["input"].(map[string]interface{})
            p.input.Forward = input["forward"].(bool)
            p.input.Backward = input["backward"].(bool)
            p.input.Left = input["left"].(bool)
            p.input.Right = input["right"].(bool)
        case "Chat":
            text := msg["text"].(string)
            p.room.broadcast <- ChatServerMessage{Type: "Chat", ID: p.id, Text: text}
        }
    }
}

func (p *Player) writeLoop() {
    for msg := range p.send {
        p.conn.WriteJSON(msg)
    }
}

func (p *Player) update() {
    speed := 5.0
    dt := 0.05
    dx, dz := 0.0, 0.0
    if p.input.Forward {
        dz -= 1
    }
    if p.input.Backward {
        dz += 1
    }
    if p.input.Left {
        dx -= 1
    }
    if p.input.Right {
        dx += 1
    }
    length := math.Hypot(dx, dz)
    if length > 0 {
        dx /= length
        dz /= length
    }
    p.pos.X += dx * speed * dt
    p.pos.Z += dz * speed * dt
}

func (p *Player) state() PlayerState {
    return PlayerState{
        ID:   p.id,
        Name: p.name,
        X:    p.pos.X,
        Y:    p.pos.Y,
        Z:    p.pos.Z,
    }
}
