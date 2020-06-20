import React, { useState, useEffect } from 'react';
import moment from 'moment';

const CountDown = ({ startDate }: any) => {
  const realStartDate = moment(startDate).format('YYYY-MM-DD');

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    setInterval(() => getTimeUntil(realStartDate), 1000);
  }, [realStartDate]);

  function getTimeUntil(realStartDate: any) {
    const time =
      Date.parse(realStartDate) -
      Date.parse(new Date() + '') -
      7 * 60 * 60 * 1000;

    setTime(time);

    setSeconds(Math.floor((time / 1000) % 60));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setDays(Math.floor((time / (1000 * 60 * 60 * 24)) % 30));
  }

  function add0(number: any) {
    return number < 10 ? '0' + number : number;
  }
  return time === 0 ? null : (
    <>{`${add0(days)}:${add0(hours)}:${add0(minutes)}:${add0(seconds)}`}</>
  );
};

export default CountDown;
