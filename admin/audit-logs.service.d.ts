import { Model } from 'mongoose';
import { AuditLogDocument } from '../schemas/audit-log.schema';
export declare class AuditLogsService {
    private auditLogModel;
    constructor(auditLogModel: Model<AuditLogDocument>);
    findAll(filters: {
        actor?: string;
        action?: string;
        targetType?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }): Promise<{
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
