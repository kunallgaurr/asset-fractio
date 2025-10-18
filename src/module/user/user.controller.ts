import { Body, Controller, Header, Headers, Post, UsePipes } from "@nestjs/common";
import { UserService } from "./services/user.service";
import { signupSchema, type TSignin, type TSignup } from "./user.dto";
import { ZodValidationPipe } from "src/helpers/pipes";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Post('signup')
    @UsePipes(new ZodValidationPipe(signupSchema))
    async signup(
        @Body() body: TSignup,
        @Headers() header
    ) {
        return await this.userService.signup({ payload: body, header });
    }

    @Post('signin')
    async signin(@Body() body: TSignin) {
        return await this
    }
}