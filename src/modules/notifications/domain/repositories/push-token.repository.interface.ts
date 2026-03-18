export const PUSH_TOKEN_REPOSITORY = Symbol('PUSH_TOKEN_REPOSITORY');

export interface IPushTokenRepository {
  findTokensByUserId(userId: string): Promise<string[]>;
  upsert(userId: string, token: string): Promise<void>;
}
