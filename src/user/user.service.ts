import * as argon from 'argon2';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDTO } from './dto';
import { ChangePasswordDTO } from './dto/change.password.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(id: number, dto: EditUserDTO) {
    const user = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        ...dto,
      },
    });

    delete user.password;

    return { data: user };
  }

  async changePassword(id: number, dto: ChangePasswordDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    const correctPassword = await argon.verify(
      user.password,
      dto.currentPassword,
    );

    if (!correctPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const samePassword = await argon.verify(user.password, dto.newPassword);

    if (samePassword) {
      throw new BadRequestException('Invalid data');
    }

    const hash = await argon.hash(dto.newPassword);

    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        password: hash,
      },
    });

    return { message: 'Password changed' };
  }
}
