import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { FirebaseModule } from './firebase/firebase.module';
import { PrismaModule } from './prisma/prisma.module';
import { MusicGenerationModule } from './music/module/music-generation.module';
import { PlaylistModule } from './playlist/module/playlist.module';
import { SubscriptionModule } from './subscription/module/subscription.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    PrismaModule,
    MusicGenerationModule,
    PlaylistModule,
    SubscriptionModule,
    AccountModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
