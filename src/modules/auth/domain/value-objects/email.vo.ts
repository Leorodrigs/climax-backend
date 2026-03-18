export class Email {
  public readonly value: string;

  constructor(email: string) {
    if (!this.validate(email)) {
      throw new Error(`E-mail inválido: ${email}`);
    }
    this.value = email.toLowerCase().trim();
  }

  private validate(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
