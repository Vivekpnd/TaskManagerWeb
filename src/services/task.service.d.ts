export declare const getUserTasks: (userId: string) => import(".prisma/client").Prisma.PrismaPromise<{
    userId: string;
    id: string;
    createdAt: Date;
    title: string;
    description: string | null;
    status: boolean;
}[]>;
export declare const createTask: (userId: string, title: string) => import(".prisma/client").Prisma.Prisma__TaskClient<{
    userId: string;
    id: string;
    createdAt: Date;
    title: string;
    description: string | null;
    status: boolean;
}, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare const updateTask: (id: string, title: string) => import(".prisma/client").Prisma.Prisma__TaskClient<{
    userId: string;
    id: string;
    createdAt: Date;
    title: string;
    description: string | null;
    status: boolean;
}, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare const deleteTask: (id: string) => import(".prisma/client").Prisma.Prisma__TaskClient<{
    userId: string;
    id: string;
    createdAt: Date;
    title: string;
    description: string | null;
    status: boolean;
}, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare const toggleTask: (id: string) => Promise<{
    userId: string;
    id: string;
    createdAt: Date;
    title: string;
    description: string | null;
    status: boolean;
}>;
//# sourceMappingURL=task.service.d.ts.map