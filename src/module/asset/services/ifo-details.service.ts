import { Injectable } from "@nestjs/common";
import { IfoDetailsRepository } from "../repositories/ifo-detail.repository";
import { constants, HttpResponse } from "src/utils";
import { IfoDetailsEntity } from "../entities";

@Injectable()
export class IfoDetailsService {
    constructor(
        private readonly ifoDetails: IfoDetailsRepository,
    ) { }


    async addIfoDetails(payload) {
        try {
            const { assetId, adminFee, availableFractions, fractions, initialValue } = payload;

            const ifoDetails = new IfoDetailsEntity();
            ifoDetails.assetId = assetId;
            ifoDetails.adminFee = adminFee;
            ifoDetails.availableFractions = availableFractions;
            ifoDetails.fractions = fractions;
            ifoDetails.initialValue = initialValue;

            const savedIfoDetails = await this.ifoDetails.save(ifoDetails);

            return HttpResponse.success(savedIfoDetails);
        } catch (error) {
            return HttpResponse.internalServerError()
        }
    }

    async purchaseInInitialOfferring(payload) {
        try {
            const { assetId, fractions } = payload;

            const ifoDetails = await this.ifoDetails.findOne({
                where: { assetId }
            });

            if (!ifoDetails) return HttpResponse.notFound();
            if(fractions > ifoDetails.fractions) {
                return HttpResponse.badRequest('Cannot buy fractions more than initial fraction.')
            }

            const initialPart = constants.IFO_PRICE_PARTS.INITIAL;
            const gstPercentage = constants.GST_PERCENTAGE;

            const amount = ifoDetails.initialValue * fractions * initialPart;
            const adminFee = (amount / 100) * ifoDetails.adminFee;
            const gst = amount * gstPercentage / 100;

            const totalAmount = amount + adminFee + gst;

            // Create razorpay order

            return HttpResponse.success();
        } catch (error) {

        }
    }
}