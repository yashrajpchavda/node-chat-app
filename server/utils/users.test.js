const expect = require( "expect" );

const { Users } = require( "./users" );

describe( "Users", () => {

  let users;

  beforeEach( () => {
    users = new Users();
    users.users = [ {
      id: "1",
      name: "James",
      room: "Node Course"
    }, {
      id: "2",
      name: "Anderson",
      room: "React Course"
    }, {
      id: "3",
      name: "Rupal",
      room: "Node Course"
    } ];
  } );

  it( "should add new user", () => {
    const users = new Users();
    const user = { id: 1234, name: "Yashraj", room: "The Guitarists" };
    users.addUser( user.id, user.name, user.room );

    expect( users.users ).toEqual( [ user ] );
  } );

  it( "should return names for Node Course", () => {

    const userList = users.getUserList( "Node Course" );
    expect( userList ).toEqual( [ "James", "Rupal" ] );

  } );

  it( "should return names for React Course", () => {
    const userList = users.getUserList( "React Course" );
    expect( userList ).toEqual( [ "Anderson" ] );
  } );

  it( "should remove a user", () => {
    const removedUser = users.removeUser( "1" );
    expect( users.users.length ).toBe( 2 );
    expect( removedUser ).toMatchObject( { id: "1", name: "James" } );
  } );

  it( "should not remove user", () => {
    const removedUser = users.removeUser( "10" );
    expect( users.users.length ).toBe( 3 );
    expect( removedUser ).toBeFalsy();
  } );

  it( "should find user", () => {
    const foundUser = users.getUser( "1" );
    expect( foundUser ).toEqual( users.users[ 0 ] );
  } );

  it( "should not find user", () => {
    const foundUser = users.getUser( "10" );
    expect( foundUser ).toBeFalsy();
  } );

} );