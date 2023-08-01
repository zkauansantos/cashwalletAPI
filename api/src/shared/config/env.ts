import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

class Env {
  @IsNotEmpty()
  @IsString()
  jwtSecret: string;

  @IsNotEmpty()
  @IsString()
  database: string;
}

export const env: Env = plainToInstance(Env, {
  jwtSecret: process.env.JWT_SECRET,
  database: process.env.DATABASE_URL,
});

const errors = validateSync(env);

if (errors.length > 0) {
  throw new Error(JSON.stringify(errors, null, 2));
}
