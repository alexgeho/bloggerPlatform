"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToPostInputDto = mapToPostInputDto;
function mapToPostInputDto(input) {
    var _a, _b, _c, _d;
    // Здесь input.data — это твой объект для обновления
    return {
        id: Number(input.data.id), // преобразуем string в number
        title: (_a = input.data.title) !== null && _a !== void 0 ? _a : '', // если нет поля — будет пустая строка
        shortDescription: (_b = input.data.shortDescription) !== null && _b !== void 0 ? _b : '',
        content: (_c = input.data.content) !== null && _c !== void 0 ? _c : '',
        blogId: (_d = input.data.blogId) !== null && _d !== void 0 ? _d : '',
        createdAt: new Date().toISOString(), // или другое значение, если надо
    };
}
