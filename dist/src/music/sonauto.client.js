"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SonautoClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SonautoClient = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@fal-ai/client");
const FAL_MODEL = 'sonauto/v2/text-to-music';
let SonautoClient = SonautoClient_1 = class SonautoClient {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(SonautoClient_1.name);
    }
    onModuleInit() {
        const key = this.config.get('FAL_KEY') ??
            this.config.get('FAL_API_KEY');
        if (!key) {
            throw new Error('FAL_KEY or FAL_API_KEY is required');
        }
        client_1.fal.config({ credentials: key });
    }
    async generate(input) {
        let loggedCount = 0;
        const result = await client_1.fal.subscribe(FAL_MODEL, {
            input,
            logs: true,
            onQueueUpdate: (update) => {
                if (update.status === 'IN_PROGRESS' && update.logs) {
                    const newLogs = update.logs.slice(loggedCount);
                    newLogs
                        .map((log) => log.message)
                        .forEach((msg) => this.logger.debug(msg));
                    loggedCount = update.logs.length;
                }
            },
        });
        return result;
    }
};
exports.SonautoClient = SonautoClient;
exports.SonautoClient = SonautoClient = SonautoClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SonautoClient);
//# sourceMappingURL=sonauto.client.js.map