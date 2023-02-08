import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUser } from './aggregates/create-user';
import { UpdateUser } from './aggregates/update-user';
import { hash } from "bcrypt";

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async getAll() {
        return await this.prismaService.users.findMany({
            select: {
                id: true,
                username: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }

    async findFirstOrThrowByUsername(username: string) {
        return await this.prismaService.users.findFirstOrThrow({
            where: { username }
        });
    }

    async findFirstOrThrowByIdentifier(id: string) {
        return await this.prismaService.users.findFirstOrThrow({
            where: { id }
        });
    }

    async create(user: CreateUser) {
        const savedUser = await this.findFirstOrThrowByUsername(user.username);

        if (savedUser) {
            throw new Error("Invalid username or password");
        }

        const hashPassword = await hash(user.password, 10);
        return await this.prismaService.users.create({
            data: {
                username: user.username,
                password: hashPassword,
            },
            select: {
                id: true,
                username: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }

    async update(id: string, user: UpdateUser) {
        const hashPassword = await hash(user.password, 10);
        return await this.prismaService.users.update({
            where: { id },
            data: {
                username: user.username,
                password: hashPassword,
                updatedAt: new Date(),
            },
            select: {
                id: true,
                username: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }

    async delete(id: string) {
        await this.prismaService.users.delete({
            where: { id }
        });
        return true;
    }

    async deleteMany(ids: string[]) {
        await this.prismaService.users.deleteMany({
            where: { id: { in: ids } }
        });
        return true;
    }
}
