import { Body, Controller, Get, Post, Put, UsePipes } from "@nestjs/common";
import { AssetService } from "../services";
import { AddAssetSchema, type TAddAsset } from "../asset.dto";
import { ZodValidationPipe } from "src/helpers/pipes";

@Controller('asset')
export class AssetController {
    constructor(
        private readonly assetService: AssetService
    ) {}

    @Post('add')
    @UsePipes(new ZodValidationPipe(AddAssetSchema))
    async addAsset(@Body() body: TAddAsset) {
        return await this.assetService.addAsset(body)
    }

    @Get('fetch-all ')
    async getAllAssets(@Body() body: TAddAsset) {
        return await this.assetService.getAllAssets()
    }

    @Get('fetch')
    async getAsset(@Body() body: TAddAsset) {
        return await this.assetService.getAsset()
    }

    @Put('approve')
    async approveAsset(@Body() body: TAddAsset) {
        return await this.assetService.approveAsset(body)
    }

    @Put('reject')
    async rejectAsset(@Body() body: TAddAsset) {
        return await this.assetService.rejectAsset(body)
    }

    @Put('update')
    async updateAsset(@Body() body: TAddAsset) {
        return await this.assetService.updateAsset(body)
    }
}