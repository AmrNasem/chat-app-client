export const getCookie = (key) => {
  const targettedCookie = document.cookie
    .split(";")
    .find((cookie) => cookie.trim().split("=")[0] === key);
  if (!targettedCookie) return;

  return JSON.parse(decodeURIComponent(targettedCookie.trim()).split("=")[1]);
};
