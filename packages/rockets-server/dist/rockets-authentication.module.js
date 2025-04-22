"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketsAuthenticationModule = void 0;
const common_1 = require("@nestjs/common");
const rockets_authentication_module_definition_1 = require("./rockets-authentication.module-definition");
let RocketsAuthenticationModule = class RocketsAuthenticationModule extends rockets_authentication_module_definition_1.AuthenticationModuleClass {
    static forRoot(options) {
        return super.register(Object.assign(Object.assign({}, options), { global: true }));
    }
    static forRootAsync(options) {
        return super.registerAsync(Object.assign(Object.assign({}, options), { global: true }));
    }
};
RocketsAuthenticationModule = __decorate([
    (0, common_1.Module)({})
], RocketsAuthenticationModule);
exports.RocketsAuthenticationModule = RocketsAuthenticationModule;
//# sourceMappingURL=rockets-authentication.module.js.map