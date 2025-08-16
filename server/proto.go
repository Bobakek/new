package main

type InputState struct {
    Forward  bool `json:"forward"`
    Backward bool `json:"backward"`
    Left     bool `json:"left"`
    Right    bool `json:"right"`
}

type PlayerState struct {
    ID   string  `json:"id"`
    Name string  `json:"name"`
    X    float64 `json:"x"`
    Y    float64 `json:"y"`
    Z    float64 `json:"z"`
}

type StateMessage struct {
    Type    string        `json:"type"`
    You     string        `json:"you"`
    Players []PlayerState `json:"players"`
}

type ChatServerMessage struct {
    Type string `json:"type"`
    ID   string `json:"id"`
    Text string `json:"text"`
}
