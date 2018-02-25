const path = require( "path" );
const http = require( "http" );
const express = require( "express" );
const socketIO = require( "socket.io" );

const { generateMessage } = require( "./utils/message" );

const publicPath = path.join( __dirname, "..", "public" );

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer( app );
const io = socketIO( server );

app.use( express.static( publicPath ) );

io.on( "connection", ( socket ) => {
  console.log( "New user connected" );

  socket.emit( "newMessage", generateMessage( "Admin", "Welcome to the chat app!" ) );

  socket.broadcast.emit( "newMessage", generateMessage( "Admin", "New user has joined" ) );

  socket.on( "createMessage", ( message, callback ) => {
    console.log( "createMessage", message );

    // to broadcast to everyone
    io.emit( "newMessage", generateMessage( message.from, message.text ) );

    callback( "This message is from server" );

    // to broadcast everyone but the socket
    // socket.broadcast.emit( "newMessage", {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // } );

  } );

  socket.on( "disconnect", () => {
    console.log( "User has been disconnected" );
  } );

} );

server.listen( port, () => {
  console.log( `server started on ${port}` );
} );

module.exports = app;


