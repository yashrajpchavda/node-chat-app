const expect = require( "expect" );

const { generateMessage, generateLocationMessage } = require( "./message" );

describe( "generateMessage", () => {

  it( "should generate the correct message object", () => {

    const from = "from";
    const text = "text";

    const message = generateMessage( from, text );

    expect( message ).toMatchObject( { from, text } );
    expect( typeof message.createdAt ).toBe( "number" );

  } );

} );

describe( "generateLocationMessage", () => {
  it( "should generate correct location object", () => {

    const from = "from";
    const latitude = 123;
    const longitude = 122.2;
    const generatedUrl = "https://www.google.com/maps?q=123,122.2";

    const message = generateLocationMessage( from, latitude, longitude );

    expect( message ).toMatchObject( { from, url: generatedUrl } );
    expect( typeof message.createdAt ).toBe( "number" );

  } );
} );
