"use client"
import { useSocket } from "@/hooks/useSocket";
import { useEffect } from "react";
export default function SocketPage() {
    const { socket, isConnected } = useSocket();
    useEffect(() => {
        if (!socket) return;
        socket.on("pingAll", (data) => {
            console.log(data, " en el useeffect");
        });
        socket.on("reenviando", (data) => {
            console.log(data)
        })
        socket.on("enQueSalaEstoy", data => console.log(data))
        socket.on("newMessage", data => console.log(data))
    }, [socket]);

    function pingAll() {
        if (!socket) return;
        socket.emit("emitiendo", { msg: "Hola desde mi compu" });
    }
    function entrarAsala2() {
        if (!socket) return;
        socket.emit("joinRoom", { room: "sala2" });
    }
    function salirDeSala2() {
        if (!socket) return;
        socket.emit("exitRoom", { room: "sala2" });
    }
    function mensajeASala() {
        if (!socket) return;
        socket.emit("sendMessage", { msg: "estoy en una sala, y tu?" });
    }
    function entrarAsala3() {
        if (!socket) return;
        socket.emit("joinRoom", { room: "sala3" });
    }
    function salirDeSala3() {
        if (!socket) return;
        socket.emit("exitRoom", { room: "sala3"});
    }

    return (
        <div>
            <button onClick={pingAll}>Pinge a todos</button>
            <button onClick={entrarAsala2}>entra a sala 2</button>
            <button onClick={entrarAsala3}>entra a sala 3</button>
            <button onClick={mensajeASala}>mensaje a la sala</button>
        </div>
    )
}