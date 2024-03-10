import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDTO } from './dto';
import { UserService } from './user.service';
import { ChangePasswordDTO } from './dto/change.password.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private service: UserService) {}

  @Get('me')
  get(@GetUser() user: User) {
    return { data: user };
  }

  @Patch('me')
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDTO) {
    return this.service.editUser(userId, dto);
  }

  @Patch('change-password')
  changePassword(
    @GetUser('id') userId: number,
    @Body() dto: ChangePasswordDTO,
  ) {
    return this.service.changePassword(userId, dto);
  }
}
