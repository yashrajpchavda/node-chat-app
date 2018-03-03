const moment = require( "moment" );

// var date = new Date();
//
// console.log( date.getMonth() );

const t1 = moment().valueOf();
console.log( t1 );
const timeStampe = 1234;
const date = moment(timeStampe);
// date.add( 1, "year" );

console.log( date.format( "MMM Do, YYYY" ) );
console.log( date.format( "h:mm a" ) );