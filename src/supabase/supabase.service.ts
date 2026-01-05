import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor(private readonly configService: ConfigService) {
        const projectUrl = this.configService.get<string>('SUPABASE_PROJECT_URL');
        const apiKey = this.configService.get<string>('SUPABASE_API_KEY');

        if (!projectUrl) {
            throw new Error('SUPABASE_PROJECT_URL is not defined');
        }

        if (!apiKey) {
            throw new Error('SUPABASE_API_KEY is not defined');
        }

        this.supabase = createClient(projectUrl, apiKey);
    }

    async getDefaultImages() {
        const BUCKET_ID = 'File Uploads';
        const FOLDER_NAME = 'defaults';

        // 1. List files inside the 'defaults' folder
        const { data, error } = await this.supabase.storage
            .from(BUCKET_ID)
            .list(FOLDER_NAME, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            });

        if (error) {
            console.error('Error listing images:', error);
            return [];
        }

        // 2. Construct the Public URLs
        const imageUrls = data
            .filter((file) => file.name !== '.emptyFolderPlaceholder') // Ignore empty folder markers
            .map((file) => {
                const filePath = `${FOLDER_NAME}/${file.name}`;

                const { data: publicUrlData } = this.supabase.storage
                    .from(BUCKET_ID)
                    .getPublicUrl(filePath);

                return {
                    name: file.name,
                    url: publicUrlData.publicUrl,
                };
            });

        return imageUrls;
    }

    async uploadFile(file: Express.Multer.File) {
        const bucket = 'File Uploads';

        // Create a unique file name (e.g., timestamp-originalName)
        const fileName = `${Date.now()}-${file.originalname}`;

        // Upload the file buffer to Supabase
        const { data, error } = await this.supabase.storage
            .from(bucket)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw new BadRequestException('Image upload failed');
        }

        // Get the Public URL
        const { data: publicUrlData } = this.supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return {
            url: publicUrlData.publicUrl,
            path: data.path,
        };
    }
}
