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

  var params = jQuery.deparam( window.location.search );

  socket.emit( "join", params, function ( err ) {
    if ( err ) {
      alert( err );
      window.location.href = "/";
    } else {
      console.log( "No error" );
    }
  } );
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

socket.on( "updateUserList", function ( users ) {
  console.log( "Users List", users );

  var $ol = jQuery( "<ol>" );

  users.forEach( function ( user ) {
    var $li = jQuery( "<li>" ).text( user );
    $ol.append( $li );
  } );

  jQuery( "#users" ).html( $ol );

} );

socket.on( "disconnect", function () {
  console.log( "Disconnected from server" );
} );

jQuery( document ).ready( function () {

  jQuery( "#message-form" ).on( "submit", function ( event ) {
    event.preventDefault();

    var $messageInput = jQuery( "#message" );

    socket.emit( "createMessage", {
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