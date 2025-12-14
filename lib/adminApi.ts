// Admin API utilities for authentication and CRUD operations

// Always use relative path to leverage Next.js rewrites
// Next.js rewrites /api/* to the backend API based on next.config.js
// This works in both browser and server contexts
const API_BASE = '';

export class AdminAPI {
    // Authentication
    static async login(username: string, password: string) {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include',
        });
        if (!res.ok) throw new Error('Login failed');
        return res.json();
    }

    static async logout() {
        const res = await fetch(`${API_BASE}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        return res.json();
    }

    static async checkAuth() {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
            credentials: 'include',
        });
        const data = await res.json();
        return data.admin || false;
    }

    // Generic CRUD operations
    static async list(resource: string) {
        const res = await fetch(`${API_BASE}/api/${resource}`, {
            credentials: 'include',
        });
        if (!res.ok) throw new Error(`Failed to fetch ${resource}`);
        return res.json();
    }

    static async create(resource: string, data: any) {
        const res = await fetch(`${API_BASE}/api/${resource}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include',
        });
        if (!res.ok) throw new Error(`Failed to create ${resource}`);
        return res.json();
    }

    static async update(resource: string, id: number, data: any) {
        const res = await fetch(`${API_BASE}/api/${resource}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include',
        });
        if (!res.ok) throw new Error(`Failed to update ${resource}`);
        return res.json();
    }

    static async delete(resource: string, id: number) {
        const res = await fetch(`${API_BASE}/api/${resource}/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!res.ok) throw new Error(`Failed to delete ${resource}`);
        return res.json();
    }

    // File upload
    static async uploadFile(endpoint: string, file: File) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${API_BASE}/api/${endpoint}`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });
        if (!res.ok) throw new Error('File upload failed');
        return res.json();
    }
}





