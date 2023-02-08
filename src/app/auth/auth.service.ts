import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor (
        private readonly usersService: UsersService,
        private readonly jtwService: JwtService
    ){}

    async login(user) {
        const payload = { sub: user.id, username: user.username };

        return {
            token: this.jtwService.sign(payload)
        }
    }

    async validateUser(username: string, password: string) {
        let user = null;

        try{
            user = await this.usersService.findFirstOrThrowByUsername(username);
        } catch(error) {
            return null;
        }

        const isPasswordValid = await compare(password, user.password);
        if(!isPasswordValid) return null;

        return user;
    }
}
