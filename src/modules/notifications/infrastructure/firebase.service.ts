import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private initialized = false;

  onModuleInit() {
    try {
      const fromEnv = process.env.FIREBASE_SERVICE_ACCOUNT;

      if (fromEnv) {
        admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(fromEnv)),
        });
      } else {
        const serviceAccountPath = path.resolve(
          process.cwd(),
          'src/config/firebase-service-account.json',
        );

        if (!fs.existsSync(serviceAccountPath)) {
          this.logger.warn(
            'Firebase não configurado: defina FIREBASE_SERVICE_ACCOUNT ou forneça src/config/firebase-service-account.json. Push notifications estarão desativadas.',
          );
          return;
        }

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccountPath),
        });
      }

      this.initialized = true;
      this.logger.log('Firebase Admin inicializado com sucesso');
    } catch (error) {
      this.logger.error(`Falha ao inicializar Firebase Admin: ${error}`);
      throw error;
    }
  }

  async sendNotification(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    if (!this.initialized) return;

    try {
      await admin.messaging().send({
        token,
        notification: { title, body },
        data,
      });
      this.logger.log(
        `Notificação enviada para token: ${token.slice(0, 20)}...`,
      );
    } catch (error) {
      this.logger.error(`Erro ao enviar notificação: ${error}`);
    }
  }

  async sendToMultiple(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    if (!this.initialized || tokens.length === 0) return;

    const messages = tokens.map((token) => ({
      token,
      notification: { title, body },
      data,
    }));

    try {
      const response = await admin.messaging().sendEach(messages);
      this.logger.log(
        `Notificações enviadas: ${response.successCount} sucesso, ${response.failureCount} falha`,
      );
    } catch (error) {
      this.logger.error(`Erro ao enviar notificações em lote: ${error}`);
    }
  }
}
