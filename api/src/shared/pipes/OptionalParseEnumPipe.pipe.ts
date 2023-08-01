import { ArgumentMetadata, ParseEnumPipe } from '@nestjs/common';

export class OptinalParseEnumPipe<T = any> extends ParseEnumPipe<T> {
  override transform(value: T, metadata: ArgumentMetadata) {
    if (!value) return undefined;

    return super.transform(value, metadata);
  }
}
