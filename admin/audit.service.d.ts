import { Model } from 'mongoose';
import { AuditLogDocument } from '../schemas/audit-log.schema';
export declare class AuditService {
    private auditLogModel;
    constructor(auditLogModel: Model<AuditLogDocument>);
    log(action: string, actorUsername: string, targetType: string, targetId: string, meta?: any): Promise<void>;
}
