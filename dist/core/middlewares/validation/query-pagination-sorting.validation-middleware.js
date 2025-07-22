"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationAndSortingDefault = void 0;
exports.paginationAndSortingValidation = paginationAndSortingValidation;
var express_validator_1 = require("express-validator"); // Импортируем функцию query для валидации query-параметров
var sort_direction_1 = require("../../types/sort-direction"); // Импортируем enum направлений сортировки
// Дефолтные значения для всех параметров пагинации и сортировки
var DEFAULT_PAGE_NUMBER = 1;
var DEFAULT_PAGE_SIZE = 10;
var DEFAULT_SORT_DIRECTION = sort_direction_1.SortDirection.Desc;
var DEFAULT_SORT_BY = 'createdAt';
// Объект с дефолтными значениями, можно использовать как начальные параметры
exports.paginationAndSortingDefault = {
    pageNumber: DEFAULT_PAGE_NUMBER,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: DEFAULT_SORT_BY,
    sortDirection: DEFAULT_SORT_DIRECTION,
};
// Главная функция-валидатор для пагинации и сортировки
function paginationAndSortingValidation(sortFieldsEnum) {
    var allowedSortFields = Object.values(sortFieldsEnum); // Получаем массив разрешённых значений
    return [
        // Валидация pageNumber
        (0, express_validator_1.query)('pageNumber')
            .optional() // Необязательный параметр
            .default(DEFAULT_PAGE_NUMBER) // Если не передали — ставим дефолт
            .isInt({ min: 1 }) // Должно быть целое >= 1
            .withMessage('Page number must be a positive integer') // Сообщение об ошибке
            .toInt(), // Преобразуем к числу
        // Валидация pageSize
        (0, express_validator_1.query)('pageSize')
            .optional()
            .default(DEFAULT_PAGE_SIZE)
            .isInt({ min: 1, max: 150 }) // 1 <= pageSize <= 150
            .withMessage('Page size must be between 1 and 100') // Сообщение (у тебя, кстати, 150, а сообщение про 100 — лучше поправить)
            .toInt(),
        // Валидация sortBy
        (0, express_validator_1.query)('sortBy')
            .optional() // Необязательно указывать
            .custom(function (value, _a) {
            var req = _a.req;
            var allowed = Object.values(sortFieldsEnum); // Все разрешённые поля
            if (!value || allowed.includes(value)) {
                return true; // Всё ок — либо не задано, либо валидное значение
            }
            // Если невалидное поле сортировки — заменяем на дефолтное (нет ошибки!)
            req.query.sortBy = allowed[0]; // или DEFAULT_SORT_BY
            return true;
        }),
        // Валидация sortDirection
        (0, express_validator_1.query)('sortDirection')
            .optional()
            .default(DEFAULT_SORT_DIRECTION) // Если не задано — Desc по умолчанию
            .isIn(Object.values(sort_direction_1.SortDirection)) // Должен быть один из вариантов SortDirection
            .withMessage("Sort direction must be one of: ".concat(Object.values(sort_direction_1.SortDirection).join(', '))),
    ];
}
//# sourceMappingURL=query-pagination-sorting.validation-middleware.js.map