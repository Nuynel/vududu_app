import {DATA_TYPES} from "../../types/event";

/**
 * Возвращает смещение часового пояса текущей системы в формате ISO 8601 ("+HH:MM" или "-HH:MM").
 *
 * **Входные данные:** Отсутствуют.
 * **Выходные данные:** Строка, представляющая смещение часового пояса в формате ISO 8601.
 *
 * @returns {string} Смещение часового пояса в формате ISO 8601.
 */
export const getFormatTimezoneOffset = () => {
  const offset = new Date().getTimezoneOffset();
  const sign = offset > 0 ? '-' : '+';
  const absOffset = Math.abs(offset);
  const hours = String(Math.floor(absOffset / 60)).padStart(2, '0');
  const minutes = String(absOffset % 60).padStart(2, '0');
  return `${sign}${hours}:${minutes}`;
};

/**
 * Форматирует строку даты в формат "YYYY-MM-DD" с учетом часового пояса UTC.
 *
 * **Входные данные:**
 * - `dateString`: Строка даты, совместимая с конструктором `Date`.
 *
 * **Выходные данные:**
 * - Строка даты в формате "YYYY-MM-DD".
 * - Пустая строка, если входные данные неверны или отсутствуют.
 *
 * @param {string} dateString - Входная строка даты.
 * @returns {string} Отформатированная дата или пустая строка.
 */
export const formatSingleDate = (dateString) => {
  if (!dateString) return ''; // Если дата не задана, возвращаем пустую строку
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ''; // Проверяем, является ли дата валидной
  // Получаем день, месяц и год, учитывая смещение временной зоны
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Месяцы начинаются с 0
  const year = date.getUTCFullYear();
  return `${year}-${month}-${day}`;
};

/**
 * Форматирует одну дату или диапазон дат в строку.
 *
 * **Входные данные:**
 * - `input`: Массив строк дат (одна или две даты).
 *
 * **Выходные данные:**
 * - Если одна дата: строка в формате "YYYY-MM-DD".
 * - Если две даты: строки дат в формате "YYYY-MM-DD", разделенные пробелом.
 * - Если входные данные неверны или отсутствуют: строка "-".
 *
 * @param {string[]} input - Массив строк дат.
 * @returns {string} Отформатированная дата или диапазон дат.
 */
export function formatDateOrRange(input) {
  if (!input[0]) return '-';
  if (input.length === 1) {
    // Если входной параметр - одна строка
    return formatSingleDate(input[0]);
  } else {
    // Если входной параметр - массив из двух строк
    return `${formatSingleDate(input[0])} ${formatSingleDate(input[1])}`;
  }
}

// TODO: Навести порядок

/**
 * Форматирует объект `Date` в строку формата "YYYY-MM-DD".
 *
 * **Входные данные:**
 * - `date`: Объект `Date`.
 *
 * **Выходные данные:**
 * - Строка даты в формате "YYYY-MM-DD".
 *
 * @param {Date} date - Дата для форматирования.
 * @returns {string} Отформатированная дата.
 */
export const getFormattedDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0'); // Добавляем ведущий ноль, если необходимо
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Месяцы начинаются с 0, добавляем 1
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

/**
 * Корректирует строку даты, учитывая смещение часового пояса.
 *
 * **Входные данные:**
 * - `value`: Строка даты в формате ISO или "YYYY-MM-DD".
 *
 * **Выходные данные:**
 * - Строка даты с учетом смещения часового пояса.
 * - Исходное значение, если оно не требует коррекции.
 *
 * @param {string} value - Входная строка даты.
 * @returns {string} Скорректированная строка даты.
 */
export const fixTimezone = (value) => {
  if (value && value.includes('Z')) {
    return value.replace('Z', getFormatTimezoneOffset());
  }
  if (value && value.length >= 10) {
    const dateWithTime = new Date(value).setHours(12);
    return new Date(dateWithTime).toISOString().replace('Z', getFormatTimezoneOffset());
  }
  return value;
};

/**
 * Сравнивает дату или диапазон дат с текущей датой в зависимости от типа данных.
 *
 * **Входные данные:**
 * - `dates`: Массив строк дат (может быть `null`).
 * - `dataType`: Тип данных (`DATA_TYPES`), определяющий логику сравнения.
 *
 * **Выходные данные:**
 * - `true` или `false` в зависимости от результата сравнения.
 *
 * @param {string[] | null} dates - Массив строк дат.
 * @param {DATA_TYPES} dataType - Тип данных для сравнения.
 * @returns {boolean} Результат сравнения дат.
 */
export const compareDates = (dates, dataType) => {
  if (!dates) return false;
  if (dataType === DATA_TYPES.PLANNED) {
    if (dates.length === 1) {
      return new Date(dates[0]) > new Date();
    }
    return new Date(dates[1]) > new Date();
  }
  if (dates.length === 1) {
    return new Date(dates[0]) < new Date();
  }
  return new Date(dates[1]) < new Date();
}

/**
 * Функция сортировки событий по дате начала.
 *
 * **Входные данные:**
 * - `prevEventData`: Объект события с массивом дат (`date`).
 * - `nextEventData`: Объект следующего события с массивом дат (`date`).
 *
 * **Выходные данные:**
 * - Число, используемое для сортировки (`< 0`, `0`, `> 0`).
 *
 * @param {Object} prevEventData - Предыдущее событие.
 * @param {Object} nextEventData - Следующее событие.
 * @returns {number} Результат сравнения дат для сортировки.
 */
export const sortDates = (prevEventData, nextEventData) => {
  return new Date(prevEventData.date[0]).valueOf() - new Date(nextEventData.date[0]).valueOf();
}

/**
 * Вычисляет разницу в миллисекундах между заданной датой и текущей датой.
 *
 * **Входные данные:**
 * - `date`: Строка даты, совместимая с конструктором `Date`.
 *
 * **Выходные данные:**
 * - Число миллисекунд между заданной и текущей датами.
 *
 * @param {string} date - Входная строка даты.
 * @returns {number} Разница в миллисекундах.
 */
export const getDateDiff = (date) => {
  return new Date(date).valueOf() - new Date().valueOf();
}

/**
 * Преобразует дату из формата "DD.MM.YYYY" в формат "YYYY-MM-DD".
 *
 * **Входные данные:**
 * - `inputValue`: Строка даты в формате "DD.MM.YYYY".
 *
 * **Выходные данные:**
 * - Строка даты в формате "YYYY-MM-DD".
 * - Пустая строка, если входные данные неверны.
 *
 * @param {string} inputValue - Входная строка даты.
 * @returns {string} Преобразованная дата или пустая строка.
 */
export const convertDateFormat = (inputValue) => {
  const [day, month, year] = inputValue.split('.');
  if (day && month && year) {
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return '';
};

