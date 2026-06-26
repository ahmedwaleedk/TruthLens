import { DetectionsService } from './detections.service';
import { CreateDetectionDto } from './dto/create-detection.dto';
import { UpdateDetectionDto } from './dto/update-detection.dto';
import { ModelService } from '../model/model.service';
export declare class DetectionsController {
    private detectionsService;
    private modelService;
    constructor(detectionsService: DetectionsService, modelService: ModelService);
    detect(body: any, file: Express.Multer.File, req: any): Promise<{
        id: string;
        timestamp: string;
        text_snippet: string;
        url: string;
        image_path: string;
        label: string;
        confidence: number;
        explanation: string;
    }>;
    create(createDto: CreateDetectionDto, req: any): Promise<{
        ok: boolean;
        id: string;
    }>;
    getTrending(req: any): Promise<any[]>;
    getStats(req: any): Promise<{
        total_detections: number;
        fake_count: number;
        real_count: number;
        average_confidence: number;
        recent_detections: {
            id: string;
            label: string;
            confidence: number;
            created_at: string;
            text_snippet: string;
        }[];
    }>;
    findAll(req: any): Promise<{
        id: string;
        user_id: string;
        text: string;
        image_url: string;
        url: string;
        label: string;
        confidence: number;
        explanation: string;
        created_at: string;
    }[]>;
    findOne(id: string, req: any): Promise<{
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
    update(id: string, updateDto: UpdateDetectionDto, req: any): Promise<{
        ok: boolean;
        modified_count: number;
    }>;
    remove(id: string, req: any): Promise<{
        ok: boolean;
        deleted_count: number;
    }>;
}
