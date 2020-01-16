function getMinute(time: number): string {
  const _min: number = Math.floor(time / 60);
  let min: string;
  if (_min < 10) {
    min = `0${_min}`;
  } else {
    min = "" + _min;
  }
  return min;
}


function getSecond(time: number): string {
  const _sec: number = Math.floor(time % 60);
  let sec: string;
  if (_sec < 10) {
    sec = `0${_sec}`;
  } else {
    sec = "" + _sec
  }
  return sec;
}

export {
  getMinute,
  getSecond
}
