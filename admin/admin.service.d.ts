import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
import { DetectionDocument } from '../schemas/detection.schema';
export declare class AdminService {
    private userModel;
    private detectionModel;
    constructor(userModel: Model<UserDocument>, detectionModel: Model<DetectionDocument>);
    getStats(): Promise<{
        total_users: number;
        total_detections: number;
        fake_count: number;
        real_count: number;
    }>;
    getRecentDetections(limit?: number): Promise<{
        id: string;
        user_id: string;
        label: string;
        confidence: number;
        created_at: string;
        text_snippet: string;
    }[]>;
    getDetections(): Promise<{
        id: string;
        user_id: string;
        label: string;
        confidence: number;
        created_at: string;
        text_snippet: string;
    }[]>;
    getDetectionById(id: string): Promise<{
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
    deleteDetection(id: string): Promise<boolean>;
}
