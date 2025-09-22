"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAuthProvider = void 0;
const common_1 = require("@nestjs/common");
let MockAuthProvider = class MockAuthProvider {
    async validateToken(token) {
        // Mock implementation - returns different data based on token
        if (token === 'token-1') {
            return {
                id: 'user-123',
                sub: 'user-123',
                email: 'user1@example.com',
                roles: ['user'],
                claims: {
                    token,
                    provider: 'mock'
                }
            };
        }
        else if (token === 'token-2') {
            return {
                id: 'user-456',
                sub: 'user-456',
                email: 'user2@example.com',
                roles: ['admin'],
                claims: {
                    token,
                    provider: 'mock'
                }
            };
        }
        // Default response for other tokens
        return {
            id: 'default-user',
            sub: 'default-user',
            email: 'default@example.com',
            roles: ['user'],
            claims: {
                token,
                provider: 'mock'
            }
        };
    }
};
exports.MockAuthProvider = MockAuthProvider;
exports.MockAuthProvider = MockAuthProvider = __decorate([
    (0, common_1.Injectable)()
], MockAuthProvider);
