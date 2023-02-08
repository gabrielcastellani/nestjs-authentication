import { Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe, InternalServerErrorException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUser } from './aggregates/create-user';
import { UpdateUser } from './aggregates/update-user';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
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
        try {
            return this.usersService.create(user);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Put(":id")
    async update(@Param("id", new ParseUUIDPipe()) id: string, @Body() user: UpdateUser) {
        try {
            return this.usersService.update(id, user);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }

    @Delete(":id")
    async delete(@Param("id", new ParseUUIDPipe()) id: string) {
        try {
            return this.usersService.delete(id);
        } catch (error) {
            throw new InternalServerErrorException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, { cause: error });
        }
    }
}
