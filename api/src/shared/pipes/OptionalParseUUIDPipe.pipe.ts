import { ArgumentMetadata, ParseUUIDPipe } from '@nestjs/common';

export class OptinalParseUUIDPipe extends ParseUUIDPipe {
  override transform(value: string, metadata: ArgumentMetadata) {
    if (!value) return undefined;

    return super.transform(value, metadata);
  }
}
