import { ApiProperty } from "@nestjs/swagger";

export class AuthResponse {
    @ApiProperty()
    access_token: string;

    @ApiProperty()
    refresh_token: string;
}