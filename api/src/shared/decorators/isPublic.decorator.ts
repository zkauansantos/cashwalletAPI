import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'IS_PUBLIC';

export default function isPublic() {
  return SetMetadata(IS_PUBLIC_KEY, true);
}
