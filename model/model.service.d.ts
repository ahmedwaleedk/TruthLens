export declare class ModelService {
    private readonly modelServiceUrl;
    predictFakeNews(text?: string, imagePath?: string | null, url?: string): Promise<{
        label: string;
        confidence: number;
        explanation: string;
    }>;
    getTrendingFakeNews(): any[];
}
