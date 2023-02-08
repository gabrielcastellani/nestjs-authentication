import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post("login")
    @UseGuards(AuthGuard("local"))
    async login(@Req() req: any) {
        return await this.authService.login(req.user);
    }
}
