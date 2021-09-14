export const convertMillisToMinutesAndSecret = (millis: number) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = Number(((millis % 60000) / 1000).toFixed(0));
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

export const calcHowLongAgo = (dateString: string) => {
  const now = new Date();
  now.setHours(now.getHours());
  const diff = now.getTime() - new Date(dateString).getTime();
  if (Math.floor(diff / (1000 * 60 * 60 * 24 * 365)) >= 1) {
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365)) + "年前";
  }
  if (Math.floor(diff / (1000 * 60 * 60 * 24 * 30)) >= 1) {
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 30)) + "ヶ月前";
  }
  if (Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) >= 1) {
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + "週間前";
  }
  if (Math.floor(diff / (1000 * 60 * 60 * 24)) >= 1) {
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + "日前";
  }
  if (Math.floor(diff / (1000 * 60 * 60)) >= 1) {
    return Math.floor(diff / (1000 * 60 * 60)) + "時間前";
  }
  if (Math.floor(diff / (1000 * 60)) >= 1) {
    return Math.floor(diff / (1000 * 60)) + "分前";
  }

  return "今";
};

export const ConvertToYearMonDay = (d: string) => {
  const date = new Date(d);
  const y = date.getFullYear();
  const m = ("00" + (date.getMonth() + 1)).slice(-2);
  const da = ("00" + date.getDate()).slice(-2);
  return y + "/" + m + "/" + da;
};
