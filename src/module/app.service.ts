import { Injectable } from "@nestjs/common";
import { HttpResponse } from "src/utils";

@Injectable()
export class AppService {
    constructor() { }

    healthCheck() {
        const date = new Date();
        return HttpResponse.success(date.toDateString());
    }
}