const express = require('express');
const path = require('path');
const {createServer} = require('http');
require('dotenv').config();
const cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const {Server} = require('socket.io');

const app = express();
app.use(cors())

// Create Socket Server
const port = process.env.PORT || 3000;
const server = new createServer(app);

// Default middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.resolve('./public')));

// DB Connection
mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Connected!");
}).catch((error) => {
    console.log(error);
});

// include routers
// API
const auth = require('./routes/auth');
const user = require('./routes/user');
const blogs = require('./routes/blogs');
const comment = require('./routes/comment');

// API USE ROUTES
app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api/blogs', blogs);
app.use('/api/comments', comment);

app.get('/', (req, res) => {
  return res.send("Hello World!");
});

// Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    //credentials: true,
    //methods: ['GET', 'POST']
  }
});

let users = []
io.on('connection', (socket) => {
    //console.log(`⚡: ${socket.id} user just connected!`)  
    socket.on("message", data => {
      io.emit("messageResponse", data)
    })

    socket.on("typing", data => (
      socket.broadcast.emit("typingResponse", data)
    ))

    socket.on("newUser", data => {
      const isFound = users.some(element => {
        if (element.userid === data.userid) {
          return true;
        }      
        return false;
      });
      if(!isFound) {
        users.push(data)
      }      
      io.emit("newUserResponse", users)
    })
 
    socket.on('disconnect', () => {
      //console.log('🔥: A user disconnected');
      users = users.filter(user => user.socketID !== socket.id)
      io.emit("newUserResponse", users)
      socket.disconnect()
    });
});


// APP Listing
server.listen(port, function() {
  console.log("Listing to port: ",port)
});
