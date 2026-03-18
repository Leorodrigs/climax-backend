import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './shared/infrastructure/database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { WeatherModule } from './modules/weather/weather.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    PrismaModule,
    AuthModule,
    WeatherModule,
    FavoritesModule,
    AlertsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
