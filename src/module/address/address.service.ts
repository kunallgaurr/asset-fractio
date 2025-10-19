import { Injectable } from "@nestjs/common";
import { AddressRepository } from "./address.repository";
import { HttpResponse } from "src/utils";

@Injectable()
export class AddressService {
    constructor(private readonly address: AddressRepository) {}

    async addAddress(payload) {
        try {
            const {isPrimary, userId} = payload;
            const addresses = await this.address.find({
                where: {userId: userId}
            });

            if(isPrimary) {
                const primaryAddress = addresses.find((e) => e.isPrimary);
                
                if(primaryAddress) {
                    primaryAddress.isPrimary = false;
                    this.address.save(primaryAddress);
                }
            }

            const address  = this.address.save(payload);
            return HttpResponse.success(address);
        } catch (error) {
           return HttpResponse.internalServerError(); 
        }
    }

    async getAddress(payload) {
        try {
            const {userId} = payload;

        } catch (error) {
            return HttpResponse.internalServerError(); 

        }
    }
}