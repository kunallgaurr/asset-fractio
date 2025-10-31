import { Body, Controller, Delete, Get, ParseIntPipe, Post, Put, Query, UsePipes } from "@nestjs/common";
import { AddressService } from "./address.service";
import { User } from "src/helpers";
import { createAddressSchema, TUpdateAddress, updateAddressSchema, type TAddAddress } from "./address.dto";
import { ZodValidationPipe } from "src/helpers/pipes";

@Controller('address')
export class AddressController {
    constructor(
        private readonly address: AddressService
    ) { }

    @Get('indian-states')
    async getIndianStates() {
        return this.address.getAllStates();
    }

    @Get('fetch-address')
    async getAddress(@User('id') id: ParseIntPipe) {
        return await this.address.getAddress({ userId: id })
    }

    @Post('add-address')
    @UsePipes(new ZodValidationPipe(createAddressSchema))
    async addAddress(@Body() body: TAddAddress, @User('id') id: ParseIntPipe) {
        return await this.address.addAddress({ ...body, userId: id});
    }

    @Put('update-address')
    @UsePipes(new ZodValidationPipe(updateAddressSchema))
    async updateAddress(@Body() body: Partial<TUpdateAddress>, @User('id') id) {
        return await this.address.updateAddress({ ...body, userId: id});
    }

    @Delete('delete-address')
    async deleteAddress(@Query() query) {
        return await this.address.deleteAddress(query);
    }
}