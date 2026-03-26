import { Module, OnModuleInit } from '@nestjs/common';
import { initFirebaseAdmin } from './firebase-admin';

@Module({})
export class FirebaseModule implements OnModuleInit {
  onModuleInit() {
    initFirebaseAdmin();
  }
}
