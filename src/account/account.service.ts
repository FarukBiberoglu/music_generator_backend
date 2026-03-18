import { Injectable, NotFoundException } from '@nestjs/common';
import { admin } from '../firebase/firebase-admin';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  async deleteAccount(firebaseUid: string): Promise<{ message: string }> {
    const user = await this.prisma.userModel.findUnique({
      where: { firebaseUid },
      select: { id: true },
    });

    if (user) {
      await this.prisma.$transaction(async (tx) => {
        await tx.favorite.deleteMany({ where: { userId: user.id } });
        await tx.playlist.deleteMany({ where: { userId: user.id } });

        const generations = await tx.musicGeneration.findMany({
          where: { userId: user.id },
          select: { id: true },
        });
        const generationIds = generations.map((g) => g.id);
        if (generationIds.length > 0) {
          await tx.song.deleteMany({
            where: { generationId: { in: generationIds } },
          });
          await tx.musicGeneration.deleteMany({
            where: { userId: user.id },
          });
        }

        await tx.userModel.delete({ where: { id: user.id } });
      });
    }

    try {
      await admin.auth().deleteUser(firebaseUid);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Firebase delete failed';
      throw new NotFoundException(
        `Hesap veritabanından silindi ancak Firebase kullanıcısı silinirken hata: ${message}`,
      );
    }

    return { message: 'Hesap başarıyla silindi.' };
  }
}
