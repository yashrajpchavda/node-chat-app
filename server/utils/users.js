class Users {

  constructor () {
    this.users = [];
  }

  addUser ( id, name, room ) {
    const user = { id, name, room };
    this.users.push( user );
    return user;
  }

  /**
   * Removes the matched user from the list and returns the matched User
   * @param id { String } the id of the user to remove
   */
  removeUser ( id ) {
    // return the user that was removed
    let matchedUser = undefined;
    this.users = this.users.filter( ( user ) => {

      if ( user.id === id ) {
        matchedUser = user;
        return false;
      }

      return true;

    } );
    return matchedUser;
  }

  getUser ( id ) {
    return this.users.filter( user => user.id === id )[0];
  }

  getUserList ( room ) {
    // return true to keep the item in the array and false to get it removed from the list
    const users = this.users.filter( ( user ) => user.room === room );
    const names = users.map( ( user ) => user.name );
    return names;
  }

}

module.exports = { Users };