import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
import { DetectionDocument } from '../schemas/detection.schema';
export declare class UsersService {
    private userModel;
    private detectionModel;
    constructor(userModel: Model<UserDocument>, detectionModel: Model<DetectionDocument>);
    findAll(page?: number, limit?: number): Promise<{
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
    findOne(id: string): Promise<{
        id: string;
        username: string;
        role: string;
        created_at: string;
        last_login_at: string;
        is_active: boolean;
        detections_count: number;
    }>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
