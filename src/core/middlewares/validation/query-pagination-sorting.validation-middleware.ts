import { query } from 'express-validator'; // Импортируем функцию query для валидации query-параметров
import { SortDirection } from '../../types/sort-direction'; // Импортируем enum направлений сортировки
import { PaginationAndSorting } from '../../types/pagination-and-sorting'; // Тип для параметров пагинации/сортировки

// Дефолтные значения для всех параметров пагинации и сортировки
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.Desc;
const DEFAULT_SORT_BY = 'createdAt';

// Объект с дефолтными значениями, можно использовать как начальные параметры
export const paginationAndSortingDefault: PaginationAndSorting<string> = {
    pageNumber: DEFAULT_PAGE_NUMBER,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: DEFAULT_SORT_BY,
    sortDirection: DEFAULT_SORT_DIRECTION,

};

// Главная функция-валидатор для пагинации и сортировки
export function paginationAndSortingValidation<T extends string>(
    sortFieldsEnum: Record<string, T>, // Передаем список разрешённых полей сортировки (enum или объект)
) {
    const allowedSortFields = Object.values(sortFieldsEnum); // Получаем массив разрешённых значений

    return [
        // Валидация pageNumber
        query('pageNumber')
            .optional() // Необязательный параметр
            .default(DEFAULT_PAGE_NUMBER) // Если не передали — ставим дефолт
            .isInt({ min: 1 }) // Должно быть целое >= 1
            .withMessage('Page number must be a positive integer') // Сообщение об ошибке
            .toInt(), // Преобразуем к числу

        // Валидация pageSize
        query('pageSize')
            .optional()
            .default(DEFAULT_PAGE_SIZE)
            .isInt({ min: 1, max: 150 }) // 1 <= pageSize <= 150
            .withMessage('Page size must be between 1 and 100') // Сообщение (у тебя, кстати, 150, а сообщение про 100 — лучше поправить)
            .toInt(),

        // Валидация sortBy
        query('sortBy')
            .optional() // Необязательно указывать
            .custom((value, { req }) => { // Кастомная функция для проверки
                const allowed = Object.values(sortFieldsEnum); // Все разрешённые поля
                if (!value || allowed.includes(value)) {
                    return true; // Всё ок — либо не задано, либо валидное значение
                }
                // Если невалидное поле сортировки — заменяем на дефолтное (нет ошибки!)
                (req.query as any).sortBy = allowed[0]; // или DEFAULT_SORT_BY
                return true;
            }),

        // Валидация sortDirection
        query('sortDirection')
            .optional()
            .default(DEFAULT_SORT_DIRECTION) // Если не задано — Desc по умолчанию
            .isIn(Object.values(SortDirection)) // Должен быть один из вариантов SortDirection
            .withMessage(
                `Sort direction must be one of: ${Object.values(SortDirection).join(', ')}`,
            ),
    ];
}
