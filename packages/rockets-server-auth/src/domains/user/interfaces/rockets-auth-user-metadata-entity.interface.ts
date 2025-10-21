export interface RocketsAuthUserMetadataEntityInterface {
  id: string;
  userId: string;
  // Clients can extend with custom fields
  [key: string]: unknown;
}
