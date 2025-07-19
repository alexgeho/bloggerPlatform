"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToPostInputDto = mapToPostInputDto;
function mapToPostInputDto(input) {
    var _a, _b, _c, _d;
    return {
        id: input.id,
        title: (_a = input.title) !== null && _a !== void 0 ? _a : '',
        shortDescription: (_b = input.shortDescription) !== null && _b !== void 0 ? _b : '',
        content: (_c = input.content) !== null && _c !== void 0 ? _c : '',
        blogId: (_d = input.blogId) !== null && _d !== void 0 ? _d : '',
        createdAt: new Date().toISOString(),
    };
}
