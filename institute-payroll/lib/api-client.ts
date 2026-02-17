
// Types 
export interface User {
    id: number;
    username: string;
    role: "ADMIN" | "STAFF";
}

export interface Teacher {
    id: number;
    name: string;
    phone: string;
    username: string;
    address?: string;
    image?: string;
    createdAt: string;
}

export interface Class {
    id: number;
    name: string;
    feePerStudent: number;
    instituteFeePercentage: number;
    createdAt: string;
}

const fetchApi = async (path: string, options?: RequestInit) => {
    const res = await fetch(path, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "API Error");
    }
    return res.json();
};

// Auth
export const loginAdmin = (username: string, password: string) =>
    fetchApi("/api/auth/login", { method: "POST", body: JSON.stringify({ username, password, type: "ADMIN" }) });

export const loginStaff = (username: string, password: string) =>
    fetchApi("/api/auth/login", { method: "POST", body: JSON.stringify({ username, password, type: "STAFF" }) });

export const loginTeacher = (username: string, password: string) =>
    fetchApi("/api/auth/login", { method: "POST", body: JSON.stringify({ username, password, type: "TEACHER" }) });

// Teachers
export const getTeachers = () => fetchApi("/api/teachers");
export const getTeacherById = (id: number) => fetchApi(`/api/teachers/${id}`);
export const createTeacher = (data: any) => fetchApi("/api/teachers", { method: "POST", body: JSON.stringify(data) });
export const updateTeacher = (id: number, data: any) => fetchApi(`/api/teachers/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteTeacher = (id: number) => fetchApi(`/api/teachers/${id}`, { method: "DELETE" });

// Classes
export const getClasses = () => fetchApi("/api/classes");
export const createClass = (data: any) => fetchApi("/api/classes", { method: "POST", body: JSON.stringify(data) });
export const updateClass = (id: number, data: any) => fetchApi(`/api/classes/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteClass = (id: number) => fetchApi(`/api/classes/${id}`, { method: "DELETE" });

// Daily Collection
export const addDailyCollection = (data: any) => fetchApi("/api/collections", { method: "POST", body: JSON.stringify(data) });
export const getDailyCollections = () => fetchApi("/api/collections");
export const getCollectionsByDate = (date: string) => fetchApi(`/api/collections?date=${date}`);
export const deleteDailyCollection = (id: number) => fetchApi(`/api/collections/${id}`, { method: "DELETE" });

// Rates
export const addRate = (data: any) => fetchApi("/api/rates", { method: "POST", body: JSON.stringify(data) });
export const deleteRate = (id: number) => fetchApi(`/api/rates/${id}`, { method: "DELETE" });

// Deductions
export const addDeduction = (data: any) => fetchApi("/api/deductions", { method: "POST", body: JSON.stringify(data) });
export const deleteDeduction = (id: number) => fetchApi(`/api/deductions/${id}`, { method: "DELETE" });

// Salary Report
export const getSalaryReport = (date: string) => fetchApi(`/api/salary-report?date=${date}`);

// Users
export const getUsers = () => fetchApi("/api/users");
export const updateUser = (id: number, data: any) => fetchApi("/api/users", { method: "PATCH", body: JSON.stringify({ id, ...data }) });
