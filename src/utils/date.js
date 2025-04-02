const second = 1000;
const minute = second * 60;
const hour = minute * 60;
export const day = hour * 24;

export const getTime = (date) => {
  const [time, amOrPm] = date.split(" ");
  return time.split(":").slice(0, 2).join(":") + " " + amOrPm;
};

export const getDate = (date) => {
  const createdAt = new Date(date);
  const diff = new Date() - createdAt;

  return diff >= 2 * day
    ? createdAt.toLocaleDateString()
    : diff >= day
    ? "Yesterday"
    : getTime(createdAt.toLocaleTimeString());
};

const withSOrWithout = (amount, unit) => ({
  amount,
  unit: amount > 1 ? `${unit}s` : unit,
});

export const getMostUnitDiff = (date) => {
  const diff = new Date().getTime() - new Date(date).getTime();
  const getMostDiff = (unit) => Math.round(diff / unit);
  if (getMostDiff(day) > 10) return;

  if (getMostDiff(day)) return withSOrWithout(getMostDiff(day), "day");
  if (getMostDiff(hour)) return withSOrWithout(getMostDiff(hour), "hour");
  if (getMostDiff(minute)) return withSOrWithout(getMostDiff(minute), "minute");
  return { amount: 0 };
};

export const getDay = (date) => {
  const days = Math.round(
    (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days > 2) return { days, text: new Date(date).toLocaleDateString() };
  if (days > 1) return { days, text: "Yesterday" };
  return { days, text: "Today" };
};
