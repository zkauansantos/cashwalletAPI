import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersRepository } from 'src/shared/database/repositories/users.repositiories';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signin(signInDto: SignInDto) {
    const { username, password } = signInDto;

    const user = await this.usersRepository.findUnique({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordMatch = await compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const jwtAcessToken = await this.generateJwtAcessToken(user.id);

    return { jwtAcessToken };
  }

  async signup(signUpDto: SignUpDto) {
    const { username, password } = signUpDto;

    const usernameAlreadyTaken = await this.usersRepository.findUnique({
      where: { username },
      select: { id: true },
    });

    if (usernameAlreadyTaken) {
      throw new ConflictException('This username is already in use.');
    }

    const hashedPassword = await hash(password, 12);

    const user = await this.usersRepository.create({
      data: {
        username,
        password: hashedPassword,
        bankAccount: {
          create: {
            balance: 100,
          },
        },
      },
    });

    const jwtAcessToken = await this.generateJwtAcessToken(user.id);

    return { jwtAcessToken };
  }

  private generateJwtAcessToken(userId: string) {
    return this.jwtService.signAsync({ sub: userId });
  }
}
