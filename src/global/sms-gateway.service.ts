import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { HttpResponse } from "src/utils";
import { Twilio } from "twilio";

@Injectable()
export class SmsGateway {
    private client: Twilio
    constructor(
        private readonly configService: ConfigService
    ) {
        this.client = new Twilio(
            this.configService.get<string>('TWILIO_ACCOUNT_SID'),
            this.configService.get<string>('TWILIO_AUTH_TOKEN')
        )
    }

    async createTemplate(payload) {
        try {
            const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
            const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
            const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

            const options: axios.AxiosRequestConfig = {
                method: 'POST',
                url: 'https://content.twilio.com/v1/Content',
                headers: {
                    Authorization: authHeader,
                    'Content-Type': 'application/json',
                },
                data: {
                    friendly_name: payload.name,
                    language: 'en',
                    variables: payload.variables ?? [],
                    types: ['twilio/whatsapp'],
                    content: {
                        body: payload.content,
                        type: 'twilio/whatsapp',
                    }
                },
            }

            const response = await axios(options);
            console.log(response);
            return response.data.sid as string;
        } catch (error) {
            throw error;
        }
    }

    async sendMessage(sid: string, to: string, variables: string) {
        try {
            const obj = {};
            for(let i = 0; i < variables.length; i++) {
                obj[variables[i]] = variables[i] 
            }

            const message = await this.client.messages.create({
                from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
                to: "whatsapp:" + to,
                contentSid: sid,
                contentVariables: JSON.stringify(obj)
            })

            return message.body
        } catch (error) {
            throw error;
        }
    }


}