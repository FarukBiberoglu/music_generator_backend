import { PrismaService } from '../prisma/prisma.service';
export declare class AccountService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    deleteAccount(firebaseUid: string): Promise<{
        message: string;
    }>;
}
