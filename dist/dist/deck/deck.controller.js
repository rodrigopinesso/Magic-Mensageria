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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeckController = void 0;
const common_1 = require("@nestjs/common");
const deck_service_1 = require("./deck.service");
const create_deck_dto_1 = require("./dto/create-deck-dto");
const update_deck_dto_1 = require("./dto/update-deck-dto");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../auth/enums/role.enum");
const roles_guard_1 = require("../auth/guards/roles.guard");
const validate_deck_1 = require("./validate/validate-deck");
const import_deck_dto_1 = require("./dto/import-deck.dto");
const cache_manager_1 = require("@nestjs/cache-manager");
let DeckController = class DeckController {
    constructor(deckService, cacheManager) {
        this.deckService = deckService;
        this.cacheManager = cacheManager;
    }
    async getCommander(name) {
        if (!name) {
            throw new Error('Missing "name" query parameter');
        }
        return this.deckService.fetchCommander(name);
    }
    async createDeckWithCommander(commanderName, deckName, req) {
        const userId = req.user.id;
        if (!commanderName || !deckName) {
            throw new common_1.BadRequestException("Comandante e nome do deck são obrigatórios.");
        }
        try {
            const newDeck = await this.deckService.createDeckWithCommander(commanderName, deckName, userId);
            await this.cacheManager.del(`myDecks_${userId}`);
            return newDeck;
        }
        catch (error) {
            throw new common_1.BadRequestException("Erro ao criar deck.");
        }
    }
    async getAllDecks() {
        return this.deckService.findAll();
    }
    async createDeck(deck) {
        return this.deckService.create(deck);
    }
    async getDeckById(id) {
        return this.deckService.findById(id);
    }
    async getMyDecks(req) {
        const userId = req.user.id;
        const cacheKey = `myDecks_${userId}`;
        const cachedDecks = await this.cacheManager.get(cacheKey);
        if (cachedDecks) {
            return cachedDecks;
        }
        const decks = await this.deckService.findDecksByUserId(userId);
        await this.cacheManager.set(cacheKey, decks);
        return decks;
    }
    importDeck(commanderDeckDto) {
        const deck = {
            commanderName: commanderDeckDto.commanderName,
            cards: commanderDeckDto.cards,
            colors: commanderDeckDto.colors,
        };
        if (!(0, validate_deck_1.validateCommanderDeck)(deck)) {
            return { message: 'Baralho inválido de Commander' };
        }
        return { message: 'Baralho importado com exito', deck: commanderDeckDto };
    }
    async updateDeck(id, deck) {
        return this.deckService.updateById(id, deck);
    }
    async deleteDeck(id) {
        return this.deckService.deleteById(id);
    }
};
exports.DeckController = DeckController;
__decorate([
    (0, common_1.Get)('commanderInfo'),
    __param(0, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeckController.prototype, "getCommander", null);
__decorate([
    (0, common_1.Post)('createDeckWithCommander'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Query)('commanderName')),
    __param(1, (0, common_1.Query)('deckName')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], DeckController.prototype, "createDeckWithCommander", null);
__decorate([
    (0, common_1.Get)('allDecks'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DeckController.prototype, "getAllDecks", null);
__decorate([
    (0, common_1.Post)('createCustomDeck'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_deck_dto_1.createDeckDto]),
    __metadata("design:returntype", Promise)
], DeckController.prototype, "createDeck", null);
__decorate([
    (0, common_1.Get)('decks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeckController.prototype, "getDeckById", null);
__decorate([
    (0, common_1.Get)('myDeck'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeckController.prototype, "getMyDecks", null);
__decorate([
    (0, common_1.Post)('importDeck'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [import_deck_dto_1.CommanderDeckDto]),
    __metadata("design:returntype", void 0)
], DeckController.prototype, "importDeck", null);
__decorate([
    (0, common_1.Put)('updateDeck/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_deck_dto_1.updateDeckDto]),
    __metadata("design:returntype", Promise)
], DeckController.prototype, "updateDeck", null);
__decorate([
    (0, common_1.Delete)('deleteDeck/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeckController.prototype, "deleteDeck", null);
exports.DeckController = DeckController = __decorate([
    (0, common_1.Controller)('decks'),
    (0, common_1.UseInterceptors)(cache_manager_1.CacheInterceptor),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [deck_service_1.DeckService, Object])
], DeckController);
//# sourceMappingURL=deck.controller.js.map