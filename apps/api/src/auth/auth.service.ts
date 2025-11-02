/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  registerUser(CreateUserDto: CreateUserDto) {
    throw new Error('Method not implemented.');
  }
}
