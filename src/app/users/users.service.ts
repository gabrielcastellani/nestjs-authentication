import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUser } from './aggregates/create-user';
import { UpdateUser } from './aggregates/update-user';
import { User } from './aggregates/user';

export interface IUsersService {
    getAll(): Promise<User[]>
    findFirstByUsername(username: string): Promise<User>
    findFirstOrThrow(id: string): Promise<User>
    create(user: CreateUser): Promise<User>
    update(id: string, user: UpdateUser): Promise<User>
    delete(id: string): Promise<boolean>
    deleteMany(ids: string[]): Promise<boolean>
}

@Injectable()
export class UsersService implements IUsersService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async getAll(): Promise<User[]> {
        const users = await this.prismaService.users.findMany();
        return users.map(user => new User(user.id, user.username));
    }

    async findFirstByUsername(username: string): Promise<User> {
        const user = await this.prismaService.users.findFirst({
            where: { username }
        });

        if(user){
            return new User(user.id, user.username);
        }

        return null;
    }

    async findFirstOrThrow(id: string): Promise<User> {
        const user = await this.prismaService.users.findFirstOrThrow({
            where: { id }
        });

        return new User(user.id, user.password);
    }

    async create(user: CreateUser): Promise<User> {
        const savedUser = await this.findFirstByUsername(user.username);

        if(savedUser){
            throw new Error("Invalid username or password");
        }

        const createdUser = await this.prismaService.users.create({
            data: {
                username: user.username,
                password: user.password,
            }
        });

        return new User(createdUser.id, createdUser.username);
    }

    async update(id: string, user: UpdateUser): Promise<User> {
        const updatedUser = await this.prismaService.users.update({
            where: { id },
            data: {
                password: user.password,
                username: user.username,
            }
        });

        return new User(updatedUser.id, updatedUser.username);
    }

    async delete(id: string): Promise<boolean> {
        await this.prismaService.users.delete({
            where: { id }
        });
        return true;
    }

    async deleteMany(ids: string[]): Promise<boolean> {
        await this.prismaService.users.deleteMany({
            where: { id: { in: ids }}
        });
        return true;
    }
}
