export default interface UserInterface {

  /**
   * @returns unique id of user
   */
  getId(): string|number;

  /**
   * @return attached user data
   */
  getUserData();

  /**
   * @return TRUE if user has authenticated successfully
   */
  isSignedIn(): boolean;

  /**
   * Role of user for RBAC subsytem
   */
  getRole(): string;
}
