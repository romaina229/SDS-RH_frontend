import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { auth } from '../api/auth';
import type { User, Tenant } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: User | null;
    tenant: Tenant | null;
    loading: boolean;
    permissions: string[];
    roles: string[];
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    hasPermission: (permission: string) => boolean;
    hasRole: (role: string) => boolean;
    updateTenant: (patch: Partial<Tenant>) => void;
    isAdmin: boolean;
    isManager: boolean;
    isEmployee: boolean;
    isSuperAdmin: boolean;
}

interface RegisterData {
    organization_name: string;
    organization_type: string;
    country: 'XOF' | 'EUR' | 'USD';
    sector: string;
    employee_count: number;
    plan: 'free' | 'starter' | 'standard' | 'business' | 'enterprise';
    cycle: 'monthly' | 'annual';
    currency: 'XOF' | 'EUR' | 'USD';
    payment: 'fedapay' | 'kkiapay' | 'card' | 'paypal' | 'transfer';
    full_name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    cgu: boolean;
    newsletter: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [roles, setRoles] = useState<string[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (): Promise<void> => {
        try {
            const response = await auth.user();
            setUser(response.data.user);
            setTenant(response.data.tenant);
            setPermissions(response.data.permissions || []);
            setRoles(response.data.roles || []);
        } catch (error) {
            console.error('Error fetching user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await auth.login({ email, password });
            const { access_token, user, tenant, permissions, roles } = response.data;

            localStorage.setItem('access_token', access_token);
            if (tenant?.id) localStorage.setItem('tenant_id', String(tenant.id));
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            setTenant(tenant);
            setPermissions(permissions || []);
            setRoles(roles || []);

            toast.success('Connexion réussie !');
            return { success: true };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erreur de connexion';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await auth.register(data);
            const { access_token, user, tenant, permissions, roles } = response.data;

            localStorage.setItem('access_token', access_token);
            if (tenant?.id) localStorage.setItem('tenant_id', String(tenant.id));
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            setTenant(tenant);
            setPermissions(permissions || []);
            setRoles(roles || ['admin_org']);

            toast.success('Organisation créée avec succès !');
            return { success: true };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erreur lors de l\'inscription';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await auth.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('tenant_id');
            localStorage.removeItem('user');
            setUser(null);
            setTenant(null);
            setPermissions([]);
            setRoles([]);
            window.location.href = '/login';
        }
    };

    const hasPermission = (permission: string): boolean => {
        return permissions.includes('*') || permissions.includes(permission);
    };

    const hasRole = (role: string): boolean => {
        return roles.includes('super_admin') || roles.includes(role);
    };

    const updateTenant = (patch: Partial<Tenant>): void => {
        setTenant((prev) => (prev ? { ...prev, ...patch } : prev));
    };

    const value: AuthContextType = {
        user,
        tenant,
        loading,
        permissions,
        roles,
        login,
        register,
        logout,
        hasPermission,
        hasRole,
        updateTenant,
        isAdmin: roles.includes('admin_org') || roles.includes('super_admin'),
        isManager: roles.includes('manager'),
        isEmployee: roles.includes('employee'),
        isSuperAdmin: roles.includes('super_admin'),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};