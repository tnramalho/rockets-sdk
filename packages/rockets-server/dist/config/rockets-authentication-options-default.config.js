"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationOptionsDefaultConfig = void 0;
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const passport_jwt_1 = require("passport-jwt");
const rockets_authentication_constants_1 = require("../rockets-authentication.constants");
const nestjs_jwt_1 = require("@concepta/nestjs-jwt");
exports.authenticationOptionsDefaultConfig = (0, config_1.registerAs)(rockets_authentication_constants_1.ROCKETS_AUTHENTICATION_MODULE_OPTIONS_DEFAULT_SETTINGS_TOKEN, () => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const authentication = {
        enableGuards: true,
    };
    const jwt = {
        default: {
            signOptions: {
                expiresIn: (_b = (_a = process.env) === null || _a === void 0 ? void 0 : _a.JWT_MODULE_DEFAULT_EXPIRES_IN) !== null && _b !== void 0 ? _b : '1h',
            },
        },
        access: {
            signOptions: {
                expiresIn: (_f = (_d = (_c = process.env) === null || _c === void 0 ? void 0 : _c.JWT_MODULE_ACCESS_EXPIRES_IN) !== null && _d !== void 0 ? _d : (_e = process.env) === null || _e === void 0 ? void 0 : _e.JWT_MODULE_DEFAULT_EXPIRES_IN) !== null && _f !== void 0 ? _f : '1h',
            },
        },
        refresh: {
            signOptions: {
                expiresIn: (_h = (_g = process.env) === null || _g === void 0 ? void 0 : _g.JWT_MODULE_REFRESH_EXPIRES_IN) !== null && _h !== void 0 ? _h : '99y',
            },
        },
    };
    configureAccessSecret(jwt.access);
    configureRefreshSecret(jwt.refresh, jwt.access);
    const authJwt = {
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    };
    const refresh = {
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromBodyField('refreshToken'),
    };
    return {
        authentication,
        jwt,
        authJwt: authJwt,
        refresh: refresh,
    };
});
function configureAccessSecret(options) {
    var _a, _b;
    if (!options) {
        throw new nestjs_jwt_1.JwtConfigUndefinedException();
    }
    if ((_a = process.env) === null || _a === void 0 ? void 0 : _a.JWT_MODULE_ACCESS_SECRET) {
        options.secret = process.env.JWT_MODULE_ACCESS_SECRET;
    }
    else if (((_b = process.env) === null || _b === void 0 ? void 0 : _b.NODE_ENV) === 'production') {
        throw new common_1.InternalServerErrorException('A secret key must be set when NODE_ENV=production');
    }
    else {
        common_1.Logger.warn('No default access token secret was provided to the JWT module.' +
            ' Since NODE_ENV is not production, a random string will be generated.' +
            ' It will not persist past this instance of the module.');
        options.secret = (0, crypto_1.randomUUID)();
    }
}
function configureRefreshSecret(options, fallbackOptions) {
    var _a;
    if (!options) {
        throw new nestjs_jwt_1.JwtConfigUndefinedException();
    }
    if (!fallbackOptions) {
        throw new nestjs_jwt_1.JwtFallbackConfigUndefinedException();
    }
    if ((_a = process.env) === null || _a === void 0 ? void 0 : _a.JWT_MODULE_REFRESH_SECRET) {
        options.secret = process.env.JWT_MODULE_REFRESH_SECRET;
    }
    else {
        common_1.Logger.log('No default refresh token secret was provided to the JWT module.' +
            ' Copying the secret from the access token configuration.');
        options.secret = fallbackOptions['secret'];
    }
}
//# sourceMappingURL=rockets-authentication-options-default.config.js.map