package main

import "time"

type Room struct {
    players   map[*Player]bool
    add       chan *Player
    remove    chan *Player
    broadcast chan interface{}
}

func NewRoom() *Room {
    r := &Room{
        players:   make(map[*Player]bool),
        add:       make(chan *Player),
        remove:    make(chan *Player),
        broadcast: make(chan interface{}, 16),
    }
    go r.run()
    return r
}

func (r *Room) run() {
    ticker := time.NewTicker(50 * time.Millisecond) // 20 ticks
    for {
        select {
        case p := <-r.add:
            r.players[p] = true
        case p := <-r.remove:
            delete(r.players, p)
        case msg := <-r.broadcast:
            for p := range r.players {
                p.send <- msg
            }
        case <-ticker.C:
            r.tick()
        }
    }
}

func (r *Room) tick() {
    var states []PlayerState
    for p := range r.players {
        p.update()
        states = append(states, p.state())
    }
    for p := range r.players {
        msg := StateMessage{Type: "State", You: p.id, Players: states}
        p.send <- msg
    }
}
