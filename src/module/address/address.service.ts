import { Injectable } from "@nestjs/common";
import { AddressRepository } from "./address.repository";
import { HttpResponse } from "src/utils";
import { IndianState } from "./address.entity";
import { TUpdateAddress } from "./address.dto";

@Injectable()
export class AddressService {
    constructor(private readonly address: AddressRepository) { }

    getAllStates() {
        return HttpResponse.success(Object.values(IndianState))
    }

    async addAddress(payload) {
        try {
            const { isPrimary, userId } = payload;
            const addresses = await this.address.find({
                where: { userId: userId }
            });

            if (isPrimary) {
                const primaryAddress = addresses.find((e) => e.isPrimary);

                if (primaryAddress) {
                    primaryAddress.isPrimary = false;
                    this.address.save(primaryAddress);
                }
            }

            const address = await this.address.save(payload);
            return HttpResponse.success(address);
        } catch (error) {
            console.log(error);
            return HttpResponse.internalServerError();
        }
    }

    async getAddress(payload) {
        try {
            const { userId } = payload;

            const addresses = await this.address.find({
                where: { userId: userId }
            });

            const sortedAddresses = addresses.sort((a, b) => {
                return (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0);
            });

            return HttpResponse.success(sortedAddresses);
        } catch (error) {
            return HttpResponse.internalServerError();
        }
    }

    async updateAddress(payload) {
        try {
            const { userId, isPrimary } = payload;

            if (isPrimary) {
                const addresses = await this.address.find({
                    where: { userId }
                });

                const primaryAddress = addresses.find(e => e.isPrimary);
                if (primaryAddress) {
                    primaryAddress.isPrimary = false;
                    this.address.save(primaryAddress);
                }
            }

            const address = await this.address.save(payload);
            return HttpResponse.success(address);
        } catch (error) {
            return HttpResponse.internalServerError();
        }
    }

    async deleteAddress(payload) {
        try {
            const { id } = payload;

            const address = await this.address.findOne({ where: { id } });
            if (!address) return HttpResponse.notFound();
            if (address.isPrimary) return HttpResponse.badRequest('Cannot delete the primary address, Please update the primary address first.')

            this.address.delete({ id });
            return HttpResponse.success();
        } catch (error) {
            return HttpResponse.internalServerError();
        }
    }
}