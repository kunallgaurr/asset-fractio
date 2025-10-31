import { Injectable } from "@nestjs/common";
import { AssetDocumentsRepository } from "../repositories";
import { OnEvent } from "@nestjs/event-emitter";
import { constants, HttpResponse } from "src/utils";
import { AssetDocumentsEntity, AssetDocumentStatusEnum } from "../entities";

@Injectable()
export class AssetDocumentsService {
    constructor(
        private readonly assetDocuments: AssetDocumentsRepository
    ) { }

    @OnEvent(constants.EVENT_NAMES.ADD_ASSET)
    async saveDocument(payload) {
        try {
            const { assetId, documents } = payload;

            const dataToSave = documents.map((document) => {
                return {
                    assetId,
                    ...document
                }
            });

            await this.assetDocuments.save(dataToSave);
        } catch (error) {
            throw error;
        }
    }

    async approveDocument(payload) {
        try {
            const { documetId } = payload;

            const updateResult = await this.assetDocuments.update(
                { id: documetId }, { status: AssetDocumentStatusEnum.APPROVED }
            );

            if (!updateResult.affected) {
                return HttpResponse.notFound();
            }

            return HttpResponse.success();
        } catch (error) {
            return HttpResponse.badRequest();
        }
    }

    async rejectDocument(payload) {
        try {
            const { documetId, remarks } = payload;

            const updateResult = await this.assetDocuments.update(
                { id: documetId }, { status: AssetDocumentStatusEnum.REJECTED, remarks }
            );

            if (!updateResult.affected) {
                return HttpResponse.notFound();
            }

            return HttpResponse.success();
        } catch (error) {
            return HttpResponse.badRequest();
        }
    }

    async updateDocumet(payload) {
        try {
            const { documetId, name, url } = payload;

            const document = await this.assetDocuments.findOne({ where: { id: documetId } });
            if (!document) {
                return HttpResponse.notFound();
            }

            const dataToUpdate: Partial<AssetDocumentsEntity> = {
                id: documetId,
                status: AssetDocumentStatusEnum.PENDING,
            }

            if (name) {
                const documents = await this.assetDocuments.find({ 
                    where: { assetId: document.assetId } 
                });
                
                const duplacateNames = documents.find((e) => e.name === name);
                if (duplacateNames) {
                    return HttpResponse.badRequest('Duplicate document name.');
                }

                dataToUpdate.name = name;
            }

            if (url) dataToUpdate.url = url;

            await this.assetDocuments.save(documetId)
            return HttpResponse.success();
        } catch (error) {
            return HttpResponse.badRequest();

        }
    }
}