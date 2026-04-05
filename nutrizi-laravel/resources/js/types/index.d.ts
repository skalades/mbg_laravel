export interface User {
    id: number;
    username: string;
    full_name: string | null;
    title: string | null;
    role: 'ADMIN' | 'NUTRITIONIST' | 'CHEF';
    kitchen_id: number | null;
    kitchen?: {
        id: number;
        kitchen_name: string;
    };
    created_at: string;
    updated_at: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
