import { Injectable } from "@nestjs/common";
import { AssetDocumentsRepository, AssetMasterRepository } from "../repositories";
import { constants, HttpResponse } from "src/utils";
import { AssetDocumentStatusEnum, AssetMasterEntity, AssetStatus } from "../entities";
import { TAddAsset } from "../asset.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class AssetService {
    constructor(
        private readonly asset: AssetMasterRepository,
        private readonly assetDocuments: AssetDocumentsRepository,
        private eventEmitter: EventEmitter2
    ) { }

    async addAsset(payload: TAddAsset) {
        try {
            const { userId, images, name, builderName, location, area, age, characteristics, documents } = payload;

            const asset = new AssetMasterEntity();
            asset.onboardedBy = userId;
            asset.images = images;
            asset.name = name;
            asset.builderName = builderName;
            asset.location = location;
            asset.area = area;
            asset.age = age;
            asset.characteristics = characteristics;

            const savedAsset = await this.asset.save(asset);

            this.eventEmitter.emit(constants.EVENT_NAMES.ADD_ASSET, { assetId: savedAsset.id, documents });
            return HttpResponse.success(asset);
        } catch (error) {
            return HttpResponse.internalServerError()
        }
    }

    getAllAssets() { }

    getAsset() { }

    getMyAssets() { }

    async approveAsset(payload) {
        try {
            const { assetId } = payload;

            const [asset, documents] = await Promise.all([
                this.asset.findOne({ where: { id: assetId } }),
                this.assetDocuments.find({ where: { assetId } })
            ]);

            if (!asset) return HttpResponse.notFound();

            if (!documents.length) {
                return HttpResponse.notFound('No documents have been uploaded yet.')
            }

            const rejectedDocuments = documents.filter((document) => document.status === AssetDocumentStatusEnum.REJECTED);
            if (rejectedDocuments.length) {
                return HttpResponse.badRequest('Some documents are still in the rejected state.');
            }

            if (asset.status !== AssetStatus.PENDING) {
                return HttpResponse.notFound('Asset is not is pending state.');
            }

            await this.asset.update({ id: assetId }, { status: AssetStatus.DOCUMENTS_APPPROVED })
            return HttpResponse.success();
        } catch (error) {
            return HttpResponse.internalServerError()
        }
    }

    async rejectAsset(payload) {
        try {
            const { assetId } = payload;

            const asset = await this.asset.findOne({ where: { id: assetId } });

            if (!asset) return HttpResponse.notFound();

            if (asset.status !== AssetStatus.PENDING) {
                return HttpResponse.notFound('Asset is not in pending state.');
            }

            await this.asset.update({ id: assetId }, { status: AssetStatus.REJECTED })
            return HttpResponse.success();
        } catch (error) {
            return HttpResponse.internalServerError()
        }
    }

    async updateAsset(payload) {
        try {
            const { assetId, area, age, builderName, characteristics, images, location, name } = payload;
            const asset = await this.asset.findOne({
                where: {
                    id: assetId
                }
            });

            if (!asset) return HttpResponse.notFound();

            asset.area = area ?? asset.area;
            asset.age = age ?? asset.age;
            asset.builderName = builderName ?? asset.builderName;
            asset.characteristics = characteristics ?? asset.characteristics;
            asset.images = images ?? asset.images;
            asset.location = location ?? asset.location;
            asset.name = name ?? asset.name;
            asset.status = AssetStatus.PENDING;

            const savedAsset = await this.asset.save(asset);
            return HttpResponse.success(savedAsset);
        } catch (error) {
            return HttpResponse.internalServerError()
        }
    }
}