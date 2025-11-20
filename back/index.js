var port = process.env.PORT || 4000; //Ejecuto el servidor en el puerto del .ENV


const cors = require('cors');
const express = require('express'); //Tipo de servidor: Express
const session = require("express-session"); // Para el manejo de las variables de sesión
var bodyParser = require('body-parser'); //Convierte los JSON
const { realizarQuery } = require('./modulos/mysql');
const { message } = require('statuses');

var app = express(); //Inicializo express
app.use(cors());

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const server = app.listen(port, () => {
    console.log(`Servidor NodeJS corriendo en http://localhost:${port}/`);
});

const io = require("socket.io")(server, {
    cors: {
        // IMPORTANTE: REVISAR PUERTO DEL FRONTEND
        origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004"], // Permitir el origen localhost:3000
        methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
        credentials: true, // Habilitar el envío de cookies
    },
});

const sessionMiddleware = session({
    //Elegir tu propia key secreta
    secret: "supersarasa",
    resave: false,
    saveUninitialized: false,
});
app.use(sessionMiddleware);
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});


//Pongo el servidor a escuchar
app.listen(port, function () {
    console.log(`HTTP ccorriendo en http://localhost:${port}`);
});

app.get('/', function (req, res) {
    res.status(200).send({
        message: 'GET Home route working fine!'
    });
});

/*
A PARTIR DE ACÁ LOS EVENTOS DEL SOCKET
A PARTIR DE ACÁ LOS EVENTOS DEL SOCKET
A PARTIR DE ACÁ LOS EVENTOS DEL SOCKET
*/

io.on("connection", (socket) => {
    const req = socket.request;
    socket.on("joinRoom", (data) => {
        console.log("🚀 ~ io.on ~ req.session.room:", req.session.room);
        if (req.session.room != undefined && req.session.room.length > 0)
            socket.leave(req.session.room);
        req.session.room = data.room;
        socket.join(req.session.room);
        io.to(req.session.room).emit("chat-messages", {
            user: req.session.user,
            room: req.session.room,
        });
        io.to(req.session.room).emit("enQueSalaEstoy", {message: `estas en sala ${req.session.room}`})
    });
    socket.on("pingAll", (data) => {
        console.log("PING ALL: ", data);
        io.emit("emitPingAll", { event: "Ping to all", message: data });
    });
    socket.on("sendMessage", (data) => {
        io.to(req.session.room).emit("newMessage", {
            room: req.session.room,
            message: data,
        });
       
    }); 
    socket.on("emitiendo", ()=>{
        io.emit("reenviando", { event: "reenviando", message: "we did it" });
    })
    socket.on("disconnect", () => {
        console.log("Disconnect");
    });
});