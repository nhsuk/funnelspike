const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const minutesInADay = 1440;

function flattenArray(arrayOfArrays) {
  return arrayOfArrays.reduce((a, b) => a.concat(b), []);
}

function getMinutesOffset(dayCount, time) {
  const [hours, minutes] = time.split(':').map(Number);
  return (minutesInADay * dayCount) + (hours * 60) + minutes;
}

function timesToMinutesSinceSunday(day, index) {
  // eslint-disable-next-line
  return day.map(times => {
    return {
      date: 'weekly',
      opens: getMinutesOffset(index, times.opens),
      closes: getMinutesOffset(index, times.closes)
    };
  });
}

function altTimesToMinutesSinceMidnight(date, sessions) {
  if (sessions.length === 0) {
    return { date };
  }
  // eslint-disable-next-line
  return sessions.map(session => {
    return {
      date,
      opens: getMinutesOffset(0, session.opens),
      closes: getMinutesOffset(0, session.closes)
    };
  });
}

function getTimesAsOffset(section) {
  if (section) {
    return flattenArray(days.map((day, index) => timesToMinutesSinceSunday(section[day], index)));
  }
  return [];
}

function getAltTimesAsOffset(section) {
  const altTimes = [];
  // 'section' is simple object we've created
  //  no need to worry about extra keys, use 'in' rather than object keys
  // eslint-disable-next-line
  for (const date in section) {
    const sessionTimes = altTimesToMinutesSinceMidnight(date, section[date]);
    altTimes.push(sessionTimes);
  }
  return flattenArray(altTimes);
}

function mergeValidAltTimes(record) {
  const validTimes = getAltTimesAsOffset(record.openingTimes.alterations).filter(e => e.date.startsWith('2017') || e.date.startsWith('2018'));
  // eslint-disable-next-line no-param-reassign
  record.openingTimesAsOffset = [...record.openingTimesAsOffset, ...validTimes];
}

function addOffsetTimes(record) {
  // eslint-disable-next-line no-param-reassign
  record.openingTimesAsOffset = record.openingTimesAsOffset || [];
  if (record.openingTimes) {
    // eslint-disable-next-line no-param-reassign
    record.openingTimesAsOffset = getTimesAsOffset(record.openingTimes.general);
    mergeValidAltTimes(record);
  }
  return record;
}

function addUrl(record) {
  // eslint-disable-next-line
  record.url = record.identifier && `http%3A%2F%2F${record.identifier}%2F`;
}

function process(record) {
  addOffsetTimes(record);
  addUrl(record);
  return record;
}

function transform(data) {
  return data && data.map(process);
}

module.exports = transform;
