const { formatDate } = require("./date-helper");
const { toFloat } = require("./number-helper");

function isChange(old, curr, { texts = [], booleans = [], dates = [], datetimes = [], numbers = [], times = [] }) {
  const arr = {};

  const compareValues = (keys, transform = (v) => v) => {
    for (const key of keys) {
      const newValue = curr?.[key];
      const oldValue = old?.[key];

      const selectedValue = newValue !== undefined && newValue !== null && newValue !== "" ? newValue : oldValue;

      const transformedOld = transform(oldValue);
      const transformedNew = transform(selectedValue);

      if (transformedOld !== transformedNew) {
        arr[key] = transformedNew;
      }
    }
  };

  compareValues(texts, (v) => (typeof v === "string" ? v.trim() : v));
  compareValues(booleans, (v) => Boolean(v));
  compareValues(dates, (v) => (v ? formatDate(v, 'yyyy-MM-dd') : null));
  compareValues(datetimes, (v) => (v ? formatDate(v, 'yyyy-MM-dd HH:mm:ss') : null));
  compareValues(numbers, (v) => (v !== null ? toFloat(v) : null));
  compareValues(times, (v) => (typeof v === "string" ? v.substring(0, 5) : null));

  return arr;
}

module.exports = {
  isChange,
};
