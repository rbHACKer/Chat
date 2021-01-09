const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const router = require("./Router/router");

dotenv.config();

mongoose.connect(process.env.DATABASE_ACCESS, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useFindAndModify: false
}, () => console.log("Database connected"));

app.use(express.json())
app.use(cors());
app.use("/app", router);
 
const users = {};

io.on('connection', socket => { 
    console.log("User connected: ", socket.id)
    // Video chat
    if (!users[socket.id]) {
        users[socket.id] = socket.id;
    }
    socket.emit("yourID", socket.id);
    io.sockets.emit("allUsers", users);
    socket.on('disconnect', () => {
        delete users[socket.id];
    })

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
    })

    socket.on("acceptCall", (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    })

    // Text Chat
    socket.on("message", (msg) => {
        console.log("Message: ",msg, socket.id);
        io.sockets.emit("newMsg", msg);
    })
});

server.listen(8000, () => console.log('server is running on port 8000'));


