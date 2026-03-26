import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { admin, isFirebaseAdminInitialized } from '../firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!isFirebaseAdminInitialized()) {
      throw new UnauthorizedException(
        'Firebase auth is not configured on this server',
      );
    }

    const request = context.switchToHttp().getRequest<Request>();

    const authHeader =
      request.headers.authorization ?? request.headers.Authorization;
    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('Authorization token missing');
    }
    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization token missing');
    }

    const token = authHeader.replace('Bearer ', '').trim();
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      (request as Request & { user?: unknown }).user = decodedToken;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }
}
