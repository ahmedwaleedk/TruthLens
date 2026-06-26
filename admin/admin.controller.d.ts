import { AdminService } from './admin.service';
import { UsersService } from './users.service';
import { DetectionsAdminService } from './detections-admin.service';
import { DashboardItemsService } from './dashboard-items.service';
import { AuditLogsService } from './audit-logs.service';
import { AuditService } from './audit.service';
export declare class AdminController {
    private adminService;
    private usersService;
    private detectionsAdminService;
    private dashboardItemsService;
    private auditLogsService;
    private auditService;
    constructor(adminService: AdminService, usersService: UsersService, detectionsAdminService: DetectionsAdminService, dashboardItemsService: DashboardItemsService, auditLogsService: AuditLogsService, auditService: AuditService);
    getStats(req: any): Promise<{
        total_users: number;
        total_detections: number;
        fake_count: number;
        real_count: number;
    }>;
    getUsers(page: string, limit: string, req: any): Promise<{
        users: {
            id: string;
            username: string;
            role: string;
            created_at: string;
            last_login_at: string;
            is_active: boolean;
            detections_count: number;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUserById(id: string, req: any): Promise<{
        id: string;
        username: string;
        role: string;
        created_at: string;
        last_login_at: string;
        is_active: boolean;
        detections_count: number;
    }>;
    deleteUser(id: string, req: any): Promise<{
        ok: boolean;
        deleted_count: number;
    }>;
    getDetections(user: string, label: string, startDate: string, endDate: string, search: string, page: string, limit: string, req: any): Promise<{
        detections: {
            id: string;
            user_id: string;
            text: string;
            image_url: string;
            url: string;
            label: string;
            confidence: number;
            explanation: string;
            created_at: string;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getDetectionById(id: string, req: any): Promise<{
        id: string;
        user_id: string;
        text: string;
        image_url: string;
        url: string;
        label: string;
        confidence: number;
        explanation: string;
        created_at: string;
    }>;
    updateDetection(id: string, updateData: any, req: any): Promise<{
        id: string;
        user_id: string;
        text: string;
        image_url: string;
        url: string;
        label: string;
        confidence: number;
        explanation: string;
        created_at: string;
    }>;
    deleteDetection(id: string, req: any): Promise<{
        ok: boolean;
        deleted_count: number;
    }>;
    getDashboardItems(activeOnly: string, req: any): Promise<{
        id: string;
        title: string;
        description: string;
        url: string;
        source: string;
        tags: string[];
        is_active: boolean;
        created_at: string;
        updated_at: string;
    }[]>;
    getDashboardItemById(id: string, req: any): Promise<{
        id: string;
        title: string;
        description: string;
        url: string;
        source: string;
        tags: string[];
        is_active: boolean;
        created_at: string;
        updated_at: string;
    }>;
    createDashboardItem(createData: any, req: any): Promise<{
        id: string;
        title: string;
        description: string;
        url: string;
        source: string;
        tags: string[];
        is_active: boolean;
        created_at: string;
        updated_at: string;
    }>;
    updateDashboardItem(id: string, updateData: any, req: any): Promise<{
        id: string;
        title: string;
        description: string;
        url: string;
        source: string;
        tags: string[];
        is_active: boolean;
        created_at: string;
        updated_at: string;
    }>;
    deleteDashboardItem(id: string, req: any): Promise<{
        ok: boolean;
        deleted_count: number;
    }>;
    getAuditLogs(actor: string, action: string, targetType: string, startDate: string, endDate: string, page: string, limit: string, req: any): Promise<{
        logs: {
            id: string;
            actor_username: string;
            action: string;
            target_type: string;
            target_id: string;
            timestamp: string;
            meta: any;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
