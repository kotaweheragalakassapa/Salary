
"use client";

// Types based on Prisma Schema
export interface User {
    id: number;
    username: string;
    password: string; // Plain text for this local implementation
    role: "ADMIN" | "STAFF";
}

export interface Teacher {
    id: number;
    name: string;
    phone: string;
    username: string;
    password: string;
    address?: string;
    image?: string;
    createdAt: string; // ISO String
}

export interface Class {
    id: number;
    name: string;
    feePerStudent: number;
    instituteFeePercentage: number;
    createdAt: string;
}

export interface TeacherRate {
    id: number;
    teacherId: number;
    classId: number;
    percentage: number;
}

export interface DailyCollection {
    id: number;
    date: string; // ISO String
    amount: number;
    studentCount: number;
    tuteCostPerStudent: number;
    postalFeePerStudent: number;
    teacherId: number;
    classId: number;
    createdAt: string;
}

export interface Deduction {
    id: number;
    teacherId: number;
    type: string; // TUTE, ADVANCE
    amount: number;
    date: string;
    description?: string;
    createdAt: string;
}

// Initial Data Seeding
const INITIAL_USERS: User[] = [
    { id: 1, username: "admin", password: "123", role: "ADMIN" },
    { id: 2, username: "staff", password: "123", role: "STAFF" },
];

const DB_KEYS = {
    USERS: "payroll_users",
    TEACHERS: "payroll_teachers",
    CLASSES: "payroll_classes",
    RATES: "payroll_rates",
    COLLECTIONS: "payroll_collections",
    DEDUCTIONS: "payroll_deductions",
};

// Helper to get ID
const getNextId = (items: any[]) => {
    if (items.length === 0) return 1;
    return Math.max(...items.map((i) => i.id)) + 1;
};

// Generic DB Limit
export class LocalDB {
    private get<T>(key: string): T[] {
        if (typeof window === "undefined") return [];
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    private set<T>(key: string, data: T[]) {
        if (typeof window === "undefined") return;
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Initialize
    init() {
        if (typeof window === "undefined") return;
        if (!localStorage.getItem(DB_KEYS.USERS)) {
            this.set(DB_KEYS.USERS, INITIAL_USERS);
        }
    }

    // Generic CRUD
    findAll<T>(key: string): T[] {
        return this.get<T>(key);
    }

    findById<T extends { id: number }>(key: string, id: number): T | undefined {
        return this.get<T>(key).find((item) => item.id === id);
    }

    create<T extends { id: number }>(key: string, item: Omit<T, "id">): T {
        const items = this.get<T>(key);
        // Force cast to T because we are adding the ID manually
        const newItem = { ...item, id: getNextId(items) } as unknown as T;
        items.push(newItem);
        this.set(key, items);
        return newItem;
    }

    update<T extends { id: number }>(key: string, id: number, updates: Partial<T>): T | null {
        const items = this.get<T>(key);
        const index = items.findIndex((i) => i.id === id);
        if (index === -1) return null;

        items[index] = { ...items[index], ...updates };
        this.set(key, items);
        return items[index];
    }

    delete(key: string, id: number): boolean {
        const items = this.get<any>(key);
        const filtered = items.filter((i) => i.id !== id);
        if (items.length === filtered.length) return false;
        this.set(key, filtered);
        return true;
    }

    // Specific Accessors
    get users() {
        return {
            findMany: () => this.findAll<User>(DB_KEYS.USERS),
            findFirst: (predicate: (u: User) => boolean) => this.findAll<User>(DB_KEYS.USERS).find(predicate),
            create: (data: Omit<User, "id">) => this.create<User>(DB_KEYS.USERS, data),
            update: (id: number, data: Partial<User>) => this.update<User>(DB_KEYS.USERS, id, data)
        }
    }

    get teachers() {
        return {
            findMany: () => this.findAll<Teacher>(DB_KEYS.TEACHERS),
            findUnique: (id: number) => this.findById<Teacher>(DB_KEYS.TEACHERS, id),
            create: (data: Omit<Teacher, "id">) => this.create<Teacher>(DB_KEYS.TEACHERS, data),
            update: (id: number, data: Partial<Teacher>) => this.update<Teacher>(DB_KEYS.TEACHERS, id, data),
            delete: (id: number) => this.delete(DB_KEYS.TEACHERS, id)
        }
    }

    get classes() {
        return {
            findMany: () => this.findAll<Class>(DB_KEYS.CLASSES),
            findUnique: (id: number) => this.findById<Class>(DB_KEYS.CLASSES, id),
            create: (data: Omit<Class, "id">) => this.create<Class>(DB_KEYS.CLASSES, data),
            update: (id: number, data: Partial<Class>) => this.update<Class>(DB_KEYS.CLASSES, id, data),
            delete: (id: number) => this.delete(DB_KEYS.CLASSES, id)
        }
    }

    get rates() {
        return {
            findMany: (predicate?: (r: TeacherRate) => boolean) => {
                const all = this.findAll<TeacherRate>(DB_KEYS.RATES);
                return predicate ? all.filter(predicate) : all;
            },
            create: (data: Omit<TeacherRate, "id">) => this.create<TeacherRate>(DB_KEYS.RATES, data),
            update: (id: number, data: Partial<TeacherRate>) => this.update<TeacherRate>(DB_KEYS.RATES, id, data),
            delete: (id: number) => this.delete(DB_KEYS.RATES, id)
        }
    }

    get dailyCollections() {
        return {
            findMany: (predicate?: (c: DailyCollection) => boolean) => {
                const all = this.findAll<DailyCollection>(DB_KEYS.COLLECTIONS);
                return predicate ? all.filter(predicate) : all;
            },
            create: (data: Omit<DailyCollection, "id">) => this.create<DailyCollection>(DB_KEYS.COLLECTIONS, data),
            update: (id: number, data: Partial<DailyCollection>) => this.update<DailyCollection>(DB_KEYS.COLLECTIONS, id, data),
            delete: (id: number) => this.delete(DB_KEYS.COLLECTIONS, id)
        }
    }

    get deductions() {
        return {
            findMany: (predicate?: (d: Deduction) => boolean) => {
                const all = this.findAll<Deduction>(DB_KEYS.DEDUCTIONS);
                return predicate ? all.filter(predicate) : all;
            },
            create: (data: Omit<Deduction, "id">) => this.create<Deduction>(DB_KEYS.DEDUCTIONS, data),
            update: (id: number, data: Partial<Deduction>) => this.update<Deduction>(DB_KEYS.DEDUCTIONS, id, data),
            delete: (id: number) => this.delete(DB_KEYS.DEDUCTIONS, id)
        }
    }
}

export const db = new LocalDB();
