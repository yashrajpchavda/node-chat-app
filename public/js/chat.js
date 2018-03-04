var socket = io();

function scrollToBottom () {

  // selectors
  var $messages = $( "#message-list" );
  var $newMessage = $messages.children( "li:last-child" );

  // heights
  var clientHeight = $messages.prop( "clientHeight" );
  var scrollTop = $messages.prop( "scrollTop" );
  var scrollHeight = $messages.prop( "scrollHeight" );
  var newMessageHeight = $newMessage.innerHeight();
  var lastMessageHeight = $newMessage.prev().innerHeight();

  if ( clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight ) {
    $messages.scrollTop( scrollHeight );
  }

}

socket.on( "connect", function () {
  console.log( "Connected to server" );
} );

socket.on( "disconnect", function () {
  console.log( "Disconnected from server" );
} );

socket.on( "newMessage", function ( message ) {

  var formattedTime = moment( message.createdAt ).format( "h:mm a" );
  var messageTemplate = $( "#message-template" ).html();

  var html = Mustache.render( messageTemplate, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  } );

  $( "#message-list" ).append( html );
  scrollToBottom();

} );

socket.on( "newLocationMessage", function ( message ) {

  var formattedTime = moment( message.createdAt ).format( "h:mm a" );
  var messageTemplate = $( "#location-message-template" ).html();

  var html = Mustache.render( messageTemplate, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  } );

  $( "#message-list" ).append( html );
  scrollToBottom();

} );

jQuery( document ).ready( function () {

  jQuery( "#message-form" ).on( "submit", function ( event ) {
    event.preventDefault();

    var $messageInput = jQuery( "#message" );

    socket.emit( "createMessage", {
      from: "User",
      text: $messageInput.val()
    }, function ( data ) {
      $messageInput.val( "" );
    } );

  } );

  var $locationButton = jQuery( "#send-location" );

  $locationButton.on( "click", function ( event ) {

    if ( !navigator.geolocation ) {
      return alert( "Geolocation not supported by your browser." );
    }

    $locationButton
      .attr( "disabled", "disabled" )
      .text( "Sending..." );

    navigator.geolocation.getCurrentPosition( function ( position ) {
      socket.emit( "createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      } );

      $locationButton
        .removeAttr( "disabled" )
        .text( "Send location" );

    }, function ( error ) {
      $locationButton
        .removeAttr( "disabled" )
        .text( "Send location" );
      alert( "Unable to fetch location." );
    } );

  } );

} );