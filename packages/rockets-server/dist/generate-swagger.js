"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSwaggerJson = void 0;
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const common_1 = require("@nestjs/common");
const rockets_server_module_1 = require("./rockets-server.module");
const typeorm_1 = require("typeorm");
const nestjs_user_1 = require("@concepta/nestjs-user");
const nestjs_otp_1 = require("@concepta/nestjs-otp");
let UserEntity = class UserEntity extends nestjs_user_1.UserSqliteEntity {
};
UserEntity = __decorate([
    (0, typeorm_1.Entity)()
], UserEntity);
let UserOtpEntity = class UserOtpEntity extends nestjs_otp_1.OtpSqliteEntity {
};
UserOtpEntity = __decorate([
    (0, typeorm_1.Entity)()
], UserOtpEntity);
async function generateSwaggerJson() {
    try {
        let SwaggerAppModule = class SwaggerAppModule {
        };
        SwaggerAppModule = __decorate([
            (0, common_1.Module)({
                imports: [
                    rockets_server_module_1.RocketsServerModule.forRoot({
                        typeorm: {
                            type: 'sqlite',
                            database: ':memory:',
                            synchronize: false,
                            autoLoadEntities: true,
                            entities: [UserEntity, UserOtpEntity],
                        },
                        jwt: {
                            settings: {
                                access: { secret: 'test-secret' },
                                refresh: { secret: 'test-secret' },
                                default: { secret: 'test-secret' },
                            },
                        },
                        entities: {
                            user: { entity: UserEntity },
                            userOtp: { entity: UserOtpEntity },
                        },
                        services: {
                            mailerService: {
                                sendMail: () => Promise.resolve(),
                            },
                        },
                    }),
                ],
            })
        ], SwaggerAppModule);
        const app = await core_1.NestFactory.create(SwaggerAppModule, {
            logger: ['error'],
        });
        const options = new swagger_1.DocumentBuilder()
            .setTitle('Rockets API')
            .setDescription('API documentation for Rockets Server')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, options);
        const outputDir = path.resolve('./swagger');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        fs.writeFileSync(path.join(outputDir, 'swagger.json'), JSON.stringify(document, null, 2));
        await app.close();
    }
    catch (error) {
        console.error('Error generating Swagger documentation:', error);
        if (error instanceof Error && error.stack) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}
exports.generateSwaggerJson = generateSwaggerJson;
if (require.main === module) {
    generateSwaggerJson();
}
//# sourceMappingURL=generate-swagger.js.map