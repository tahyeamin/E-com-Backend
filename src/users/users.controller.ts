import { Controller, Get, Delete, Patch, Body, Param } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    // Statistics for Admin Dashboard
    @Get('admin/stats')
    async getStats() {
        // Changed this.users to this.userService to match the constructor
        return this.userService.getAdminStats();
    }

    // Get all users list
    @Get()
    async findAll() {
        return this.userService.getAllUsers();
    }

    // Update user role by ID
    @Patch(':id/role')
    async updateRole(
        @Param('id') id: string,
        @Body('role') role: string,
    ) {
        return this.userService.updateUserRole(id, role);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }
}