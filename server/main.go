package main

import (
	"fmt"
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

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s", r.Method, r.URL.Path)
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		fmt.Fprint(w, "WebSocket server - open the client at <a href=\"http://localhost:5173\">http://localhost:5173</a>")
	})

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s", r.Method, r.URL.Path)
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			return
		}
		NewPlayer(conn, room)
	})

	log.Println("server listening on", port)
	http.ListenAndServe(":"+port, nil)
}
