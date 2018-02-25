var socket = io();

socket.on( "connect", function () {
  console.log( "Connected to server" );
} );

socket.on( "disconnect", function () {
  console.log( "Disconnected from server" );
} );

socket.on( "newMessage", function ( message ) {
  console.log( "newMessage", message );

  var $messageList = $( "#message-list" );
  var $listItem = $( "<li>" ).text( `${message.from}: ${message.text}` );

  $messageList.append( $listItem );

} );

$( document ).ready( function () {

  $( "#message-form" ).on( "submit", function ( event ) {
    event.preventDefault();

    var $messageInput = $( "#message" );

    socket.emit( "createMessage", {
      from: "User",
      text: $messageInput.val()
    }, function ( data ) {
      console.log( "done", data );
      $messageInput.val( "" );
    } );

  } );

} );