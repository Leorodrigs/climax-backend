export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(name: string, email: string, passwordHash: string): UserEntity {
    const now = new Date();
    return new UserEntity(
      crypto.randomUUID(),
      name,
      email,
      passwordHash,
      now,
      now,
    );
  }
}
