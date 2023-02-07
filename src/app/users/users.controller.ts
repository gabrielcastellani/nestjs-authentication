import { Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { CreateUser } from './aggregates/create-user';
import { UpdateUser } from './aggregates/update-user';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Get()
    async index() {
        return this.usersService.getAll();
    }

    @Post()
    async create(@Body() user: CreateUser) {
        return this.usersService.create(user);
    }

    @Put(":id")
    async update(@Param("id", new ParseUUIDPipe()) id: string, @Body() user: UpdateUser) {
        return this.usersService.update(id, user);
    }

    @Delete(":id")
    async delete(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.usersService.delete(id);
    }
}
