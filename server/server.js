const path = require( "path" );
const http = require( "http" );
const express = require( "express" );
const socketIO = require( "socket.io" );

const { isRealString } = require( "./utils/validation" );
const { generateMessage, generateLocationMessage } = require( "./utils/message" );
const { Users } = require( "./utils/users" );

const publicPath = path.join( __dirname, "..", "public" );

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer( app );
const io = socketIO( server );
const users = new Users();

app.use( express.static( publicPath ) );

io.on( "connection", ( socket ) => {
  console.log( "New user connected" );

  socket.on( "join", ( params, callback ) => {

    if ( !isRealString( params.name ) || !isRealString( params.room ) ) {
      callback( "Name and room name are required." );
      return;
    }

    socket.join( params.room );
    // socket.leave( params.room );

    // add the user to the users list
    // remove from other rooms if user is present there
    users.removeUser( socket.id );
    // add to the group
    users.addUser( socket.id, params.name, params.room );

    // emit the updateUserList to the room so that clients can update their list
    io.to( params.room ).emit( "updateUserList", users.getUserList( params.room ) );

    // ways to send messages to client / socket
    // io.emit => io.to('groupName').emit
    // socket.broadcast.emit => socket.broadcast.to('groupName').emit
    // socket.emit

    socket.emit( "newMessage", generateMessage( "Admin", "Welcome to the chat app!" ) );
    socket.broadcast.to( params.room ).emit( "newMessage", generateMessage( "Admin", `${ params.name } has joined.` ) );

    callback();

  } );

  socket.on( "createMessage", ( message, callback ) => {

    console.log( "createMessage", message );

    // get the user based on socket id so that we can get user's room name
    const user = users.getUser( socket.id );

    if ( user && isRealString( message.text ) ) {
      // to broadcast to everyone
      io.to( user.room ).emit( "newMessage", generateMessage( user.name, message.text ) );
    }

    callback();

  } );

  socket.on( "createLocationMessage", ( coords ) => {

    // get the user from socket id to get user's room name to send this message to
    const user = users.getUser( socket.id );

    io.to( user.room ).emit( "newLocationMessage", generateLocationMessage( user.name, coords.latitude, coords.longitude ) );

  } );

  socket.on( "disconnect", () => {

    // remove the user from the user list
    const removedUser = users.removeUser( socket.id );

    if ( removedUser ) {
      // emit the updateUserList to the room so that clients can update their list
      io.to( removedUser.room ).emit( "updateUserList", users.getUserList( removedUser.room ) );
      // add the chat message to notify that user has left
      socket.broadcast.to( removedUser.room ).emit( "newMessage", generateMessage( "Admin", `${ removedUser.name } has left.` ) );
    }

    console.log( "User has been disconnected" );

  } );

} );

server.listen( port, () => {

  console.log( `server started on ${port}` );

} );

module.exports = app;