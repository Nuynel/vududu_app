import {DATA_TYPES} from "../../types/event";

export function getFormatTimezoneOffset() {
  const offset = new Date().getTimezoneOffset();
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;
  // Формируем строку в формате ISO 8601, добавляя ведущий ноль к часам и минутам, если необходимо
  const sign = offset > 0 ? '-' : '+'; // Обратите внимание на изменение знака для соответствия ISO 8601
  return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export const formatSingleDate = (dateString) => {
  const date = new Date(dateString);
  // Получаем день, месяц и год, учитывая смещение временной зоны
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Месяцы начинаются с 0
  const year = date.getUTCFullYear();
  return `${day}.${month}.${year}`;
};

export function formatDateOrRange(input) {
  if (!input[0]) return '-'
  if (input.length === 1) {
    // Если входной параметр - одна строка
    return formatSingleDate(input);
  } else {
    // Если входной параметр - массив из двух строк
    return `${formatSingleDate(input[0])} ${formatSingleDate(input[1])}`;
  }
}

// todo навести порядок

export const getFormattedDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0'); // Добавляем ведущий ноль, если необходимо
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Месяцы начинаются с 0, добавляем 1
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export const fixTimezone = (value: string) => {
  if (value && value.includes('Z')) {
    return value.replace('Z', getFormatTimezoneOffset())
  }
  if (value && value.length >= 10) {
    const dateWithTime = (new Date(value)).setHours(12)
    return (new Date(dateWithTime)).toISOString().replace('Z', getFormatTimezoneOffset())
  }
  return value;
}

export const compareDates = (dates: string[] | null, dataType: DATA_TYPES) => {
  if (!dates) return false
  if (dataType === DATA_TYPES.PLANNED) {
    if (dates.length === 1) {
      return new Date(dates[0]) > new Date()
    }
    return new Date(dates[1]) > new Date()
  }
  if (dates.length === 1) {
    return new Date(dates[0]) < new Date()
  }
  return new Date(dates[1]) < new Date()
}

export const sortDates = (prevEventData, nextEventData) => new Date(prevEventData.date[0]).valueOf() - new Date(nextEventData.date[0]).valueOf()

export const getDateDiff = (date) => (new Date(date)).valueOf() - (new Date()).valueOf()
