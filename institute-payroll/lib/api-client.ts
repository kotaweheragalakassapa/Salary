
import { db, User, Teacher, Class, DailyCollection, Deduction, TeacherRate } from "./local-db";

// Initial Data handled by LocalDB constructor

/**
 * Mocks the API Response structure
 */
interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: number;
}

// ------------------------------------------------------------------
// Auth
// ------------------------------------------------------------------

export const loginAdmin = async (username: string, password: string): Promise<User | null> => {
    const users = db.users.findMany(); // Assuming DB is initialized
    const user = users.find(u => u.username === username && u.password === password && u.role === "ADMIN");
    return user || null;
};

export const loginStaff = async (username: string, password: string): Promise<User | null> => {
    const users = db.users.findMany();
    const user = users.find(u => u.username === username && u.password === password && u.role === "STAFF");
    return user || null;
};

export const loginTeacher = async (username: string, password: string): Promise<Teacher | null> => {
    const teachers = db.teachers.findMany();
    const teacher = teachers.find(t => t.username === username && t.password === password);
    return teacher || null;
};

// ------------------------------------------------------------------
// Teachers
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Teachers
// ------------------------------------------------------------------

export const getUsers = async (): Promise<User[]> => {
    return db.users.findMany();
};

export const updateUser = async (id: number, data: Partial<User>): Promise<User | null> => {
    return db.users.update(id, data);
};

export const getTeachers = async () => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 100));
    const teachers = db.teachers.findMany();
    const rates = db.rates.findMany();
    const classes = db.classes.findMany();

    return teachers.map(t => ({
        ...t,
        rates: rates
            .filter(r => r.teacherId === t.id)
            .map(r => ({
                ...r,
                class: classes.find(c => c.id === r.classId)
            }))
    }));
};

export const getTeacherById = async (id: number) => {
    const teacher = db.teachers.findUnique(id);
    if (!teacher) return undefined;
    const rates = db.rates.findMany(r => r.teacherId === id);
    const classes = db.classes.findMany();

    return {
        ...teacher,
        rates: rates.map(r => ({
            ...r,
            class: classes.find(c => c.id === r.classId)
        }))
    };
};

export const createTeacher = async (data: { name: string; phone: string; address?: string; image?: string }) => {
    const newTeacher = {
        ...data,
        username: data.name, // Auto-generate
        password: data.phone, // Auto-generate
        createdAt: new Date().toISOString(),
    };
    const created = db.teachers.create(newTeacher);
    return created;
};

export const updateTeacher = async (id: number, data: Partial<Teacher>) => {
    return db.teachers.update(id, data);
};

export const deleteTeacher = async (id: number): Promise<boolean> => {
    return db.teachers.delete(id);
};

// ------------------------------------------------------------------
// Classes
// ------------------------------------------------------------------

export const getClasses = async (): Promise<Class[]> => {
    return db.classes.findMany();
};

export const createClass = async (data: Omit<Class, "id" | "createdAt">): Promise<Class> => {
    return db.classes.create({ ...data, createdAt: new Date().toISOString() });
};

export const deleteClass = async (id: number): Promise<boolean> => {
    return db.classes.delete(id);
};

export const updateClass = async (id: number, data: Partial<Class>): Promise<Class | null> => {
    return db.classes.update(id, data);
};


// ------------------------------------------------------------------
// Salary / Financials
// ------------------------------------------------------------------

export const getSalaryReport = async (dateStr: string) => {
    if (!dateStr) throw new Error("Date required");

    const queryDate = new Date(dateStr);
    const startOfMonth = new Date(queryDate.getFullYear(), queryDate.getMonth(), 1);
    const endOfMonth = new Date(queryDate.getFullYear(), queryDate.getMonth() + 1, 0, 23, 59, 59);

    const teachers = db.teachers.findMany();
    const classes = db.classes.findMany();

    const report = teachers.map(teacher => {
        // 1. Get Collections
        const collections = db.dailyCollections.findMany(c => {
            const d = new Date(c.date);
            return c.teacherId === teacher.id && d >= startOfMonth && d <= endOfMonth;
        });

        // 2. Calculate
        let totalCollection = 0;
        let totalStudents = 0;
        let totalTuteCost = 0;
        let totalPostalFee = 0;
        let totalInstituteFee = 0;
        const collectionDetails = [];

        for (const collection of collections) {
            const cls = classes.find(c => c.id === collection.classId);
            if (!cls) continue; // Should not happen

            const studentCount = collection.studentCount || 0;
            const tuteCost = studentCount * (collection.tuteCostPerStudent || 0);
            const postalFee = studentCount * (collection.postalFeePerStudent || 0);
            const instFeePercent = cls.instituteFeePercentage || 0;
            const instituteFee = collection.amount * (instFeePercent / 100);

            totalCollection += collection.amount;
            totalStudents += studentCount;
            totalTuteCost += tuteCost;
            totalPostalFee += postalFee;
            totalInstituteFee += instituteFee;

            collectionDetails.push({
                date: collection.date,
                className: cls.name,
                amount: collection.amount,
                studentCount: studentCount,
                feePerStudent: cls.feePerStudent,
                tuteCostPerStudent: collection.tuteCostPerStudent,
                postalFeePerStudent: collection.postalFeePerStudent,
                instituteFeePercentage: instFeePercent,
                tuteCostTotal: tuteCost,
                postalFeeTotal: postalFee,
                instituteFeeTotal: instituteFee
            });
        }

        // Group by Class
        const classSummary = collectionDetails.reduce((acc: any[], curr) => {
            const existing = acc.find(c => c.className === curr.className);
            if (existing) {
                existing.totalCollection += curr.amount;
                existing.totalStudents += curr.studentCount;
                existing.totalTuteCost += curr.tuteCostTotal;
                existing.totalPostalFee += curr.postalFeeTotal;
                existing.totalInstituteFee += curr.instituteFeeTotal;
                existing.grossPay += curr.amount;
            } else {
                acc.push({
                    className: curr.className,
                    totalCollection: curr.amount,
                    totalStudents: curr.studentCount,
                    feePerStudent: curr.feePerStudent,
                    tuteCostPerStudent: curr.tuteCostPerStudent,
                    postalFeePerStudent: curr.postalFeePerStudent,
                    instituteFeePercentage: curr.instituteFeePercentage,
                    totalTuteCost: curr.tuteCostTotal,
                    totalPostalFee: curr.postalFeeTotal,
                    totalInstituteFee: curr.instituteFeeTotal,
                    grossPay: curr.amount,
                });
            }
            return acc;
        }, []);

        // 3. Deductions
        const deductions = db.deductions.findMany(d => {
            const date = new Date(d.date);
            return d.teacherId === teacher.id && date >= startOfMonth && date <= endOfMonth;
        });

        const automaticDeductions = totalTuteCost + totalPostalFee + totalInstituteFee;
        const manualDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
        const totalDeductions = automaticDeductions + manualDeductions;
        const grossPay = totalCollection;
        const netPay = grossPay - totalDeductions;
        const instituteRetained = automaticDeductions;

        return {
            teacherId: teacher.id,
            teacher: { id: teacher.id, name: teacher.name },
            period: { start: startOfMonth, end: endOfMonth },
            stats: {
                totalCollection,
                totalStudents,
                grossPay,
                totalTuteCost,
                totalPostalFee,
                totalInstituteFee,
                automaticDeductions,
                manualDeductions,
                totalDeductions,
                netPay,
                instituteRetained
            },
            details: {
                byClass: classSummary,
                deductions
            }
        };
    });

    return report;
};

// ------------------------------------------------------------------
// Daily Collection
// ------------------------------------------------------------------

export const addDailyCollection = async (data: Omit<DailyCollection, "id" | "createdAt">) => {
    return db.dailyCollections.create({ ...data, createdAt: new Date().toISOString() });
};

export const updateDailyCollection = async (id: number, data: Partial<DailyCollection>) => {
    return db.dailyCollections.update(id, data);
};

export const deleteDailyCollection = async (id: number) => {
    return db.dailyCollections.delete(id);
}

export const getDailyCollections = async () => {
    const collections = db.dailyCollections.findMany();
    const teachers = db.teachers.findMany();
    const classes = db.classes.findMany();

    return collections.map(c => ({
        ...c,
        teacher: teachers.find(t => t.id === c.teacherId),
        class: classes.find(cls => cls.id === c.classId)
    }));
};

export const getCollectionsByDate = async (dateStr: string) => {
    const collections = db.dailyCollections.findMany(c => c.date.startsWith(dateStr));
    const teachers = db.teachers.findMany();
    const classes = db.classes.findMany();

    return collections.map(c => ({
        ...c,
        teacher: teachers.find(t => t.id === c.teacherId),
        class: classes.find(cls => cls.id === c.classId)
    }));
}

// ------------------------------------------------------------------
// Rates
// ------------------------------------------------------------------

export const addRate = async (data: { teacherId: number; classId: number; percentage: number }) => {
    // Check if rate exists
    const existing = db.rates.findMany().find(r => r.teacherId === data.teacherId && r.classId === data.classId);
    if (existing) {
        return db.rates.update(existing.id, { percentage: data.percentage });
    }
    return db.rates.create(data);
};

export const deleteRate = async (id: number) => {
    return db.rates.delete(id);
}


// ------------------------------------------------------------------
// Deductions
// ------------------------------------------------------------------

export const addDeduction = async (data: Omit<Deduction, "id" | "createdAt">) => {
    return db.deductions.create({ ...data, createdAt: new Date().toISOString() });
};

export const deleteDeduction = async (id: number) => {
    return db.deductions.delete(id);
}
