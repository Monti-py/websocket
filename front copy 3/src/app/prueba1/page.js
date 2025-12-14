// labura aca
"use client"
import Button from "@/components/Button";
import { useSocket } from "@/hooks/useSocket";
import { useState, useEffect } from "react";
export default function Prueba1(){
    const {socket, isConnected } = useSocket()
    useEffect(()=>{
        if(!socket) return;
        socket.on("emitPingAll", (data)=>{
            console.log(data.message.message)
        })
        socket.on("newMessage", (data)=>{
            console.log(data.message)
        })
        socket.on("enQueSalaEstoy", (message)=>{
            console.log(message)
        })
    },[socket])

    function pingAll() {
        if(!socket) return;
        socket.emit("pingAll", {message: "hola pts"})
    }

    function entrarSalaFrio() {
        if(!socket) return;
        socket.emit("joinRoom", {room: "teamFrio"})
    }

    function entrarSalaCalor() {
        if(!socket) return;
        socket.emit("joinRoom", {room: "teamCalor"})
    }

    function enviarMensaje(){
        if(!socket) return;
        socket.emit("sendMessage", {message: "mensaje para miembros de sala"})
    }

    return(
        <div>
            <h1>hola pepe</h1>
            <Button onClick={pingAll} text="Clickear aca para pingear"></Button>
            <Button onClick={entrarSalaFrio} text="Team frio"></Button>
            <Button onClick={entrarSalaCalor} text="Team calor"></Button>
            <Button onClick={enviarMensaje} text="Enviar mensaje a la sala"></Button>
        </div>
    )
}
    