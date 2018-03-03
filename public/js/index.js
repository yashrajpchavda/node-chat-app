var socket = io();

socket.on( "connect", function () {
  console.log( "Connected to server" );
} );

socket.on( "disconnect", function () {
  console.log( "Disconnected from server" );
} );

socket.on( "newMessage", function ( message ) {
  console.log( "newMessage", message );

  var formattedTime = moment( message.createdAt ).format( "h:mm a" );
  var $messageList = jQuery( "#message-list" );
  var $listItem = jQuery( "<li>" ).text( `${message.from} ${formattedTime}: ${message.text}` );

  $messageList.append( $listItem );

} );

socket.on( "newLocationMessage", function ( message ) {

  var formattedTime = moment( message.createdAt ).format( "h:mm a" );
  var $messageList = jQuery( "#message-list" );
  var $listItem = jQuery( "<li>" );
  var $a = jQuery( "<a>" )
    .text( "My Current location" )
    .attr( "target", "_blank" )
    .attr( "href", message.url );

  $listItem.text( `${message.from} ${formattedTime}: ` );
  $listItem.append( $a );

  $messageList.append( $listItem );

} );

jQuery( document ).ready( function () {

  jQuery( "#message-form" ).on( "submit", function ( event ) {
    event.preventDefault();

    var $messageInput = jQuery( "#message" );

    socket.emit( "createMessage", {
      from: "User",
      text: $messageInput.val()
    }, function ( data ) {
      console.log( "done", data );
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