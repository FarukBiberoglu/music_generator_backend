import { PrismaService } from './prisma/prisma.service';
export declare class AppController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    root(): {
        status: string;
    };
    getHealth(): {
        status: string;
    };
    getReady(): Promise<{
        status: string;
        database: string;
    }>;
}
