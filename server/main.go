package main

import (
    "log"
    "net/http"
    "os"

    "github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool { return true },
}

func main() {
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    room := NewRoom()

    http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
        conn, err := upgrader.Upgrade(w, r, nil)
        if err != nil {
            return
        }
        NewPlayer(conn, room)
    })

    log.Println("server listening on", port)
    http.ListenAndServe(":"+port, nil)
}
