import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressEntity } from "./address.entity";
import { AddressRepository } from "./address.repository";
import { AddressService } from "./address.service";
import { AddressController } from "./address.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AddressEntity
        ])
    ],
    providers: [
        AddressRepository,
        AddressService
    ],
    controllers: [
        AddressController
    ]
})
export class AddressModule {}