/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';

@Injectable()
export class UserService {

  constructor (private readonly prisma: PrismaService){}

  async create(createUserDto: CreateUserDto) {
    const {password, ...user} = createUserDto
    const hashedPassword = await hash(password)
    return await this.prisma.users.create ({
      data: {
        password: hashedPassword,
        ...user,
      }
    })
  }  

  async findByEmail(email: string) {
    this.prisma.users.findUnique({
      where: {
        email,
      }
    })
  }
}
