"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketsServerModule = void 0;
const common_1 = require("@nestjs/common");
const rockets_server_module_definition_1 = require("./rockets-server.module-definition");
let RocketsServerModule = class RocketsServerModule extends rockets_server_module_definition_1.RocketsServerModuleClass {
    static forRoot(options) {
        return super.register(Object.assign(Object.assign({}, options), { global: true }));
    }
    static forRootAsync(options) {
        return super.registerAsync(Object.assign(Object.assign({}, options), { global: true }));
    }
};
RocketsServerModule = __decorate([
    (0, common_1.Module)({})
], RocketsServerModule);
exports.RocketsServerModule = RocketsServerModule;
//# sourceMappingURL=rockets-server.module.js.map