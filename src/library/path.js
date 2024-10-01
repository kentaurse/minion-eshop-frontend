export const pathSearchQuery = (q) => {
  if (q.length) {
    const a = q.slice(1);
    const qs = a.split("&");
    return qs.reduce((t, e) => {
      const b = e.split("=");
      return { ...t, [b[0]]: b[1] };
    }, {});
  } else return "";
};

export const pathQuerySearch = (queryObject) => {
  let s = "?";
  let k = false;
  for (let i in queryObject) {
    if (k) s += "&";
    else k = true;
    s += i + "=" + queryObject[i];
  }
  return s;
};
