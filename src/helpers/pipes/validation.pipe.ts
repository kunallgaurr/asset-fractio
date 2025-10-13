import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { HttpResponse } from 'src/utils';
import z from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: z.ZodSchema) { }

    transform(value: any, metadata: ArgumentMetadata) {
        try {
            const parsedValue = this.schema.parse(value);
            return parsedValue;
        } catch (error) {
            if (error instanceof z.ZodError) {
                return HttpResponse.badRequest('There was somethis wrong in the payoad.', error.issues)
            }

            return HttpResponse.internalServerError();
        }
    }
}