import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpCode, HttpStatus } from '@nestjs/common';
import { HttpStatusCode } from 'axios';
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
                throw new HttpException({
                    code: HttpStatusCode.BadRequest,
                    message: 'There was somethis wrong in the payload.',
                    result: error.issues,
                }, HttpStatus.OK)
            }

            return HttpResponse.internalServerError();
        }
    }
}