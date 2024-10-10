import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DisplayImage } from './displayImage';

interface CountdownProps {
  url: string;
  time: number;
  routeGoToBack: string;
  handleTimeout?: () => void;
}

export const Countdown = React.memo(
  function Countdown({ url, time, routeGoToBack, handleTimeout }: CountdownProps) {
    const [timeLeft, setTimeLeft] = useState<number>(time);

    const navigate = useNavigate();

    const minute = Math.floor(timeLeft / 60);
    const second = timeLeft % 60;

    useEffect(() => {
      if (timeLeft < 1) {
        if (handleTimeout) {
          handleTimeout();
        }
        navigate(routeGoToBack);
      }

      const id = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
      return () => {
        clearInterval(id);
      };
    }, [timeLeft]);

    return (
      <div className='relative h-[85px] w-[160px]'>
        <DisplayImage src={url} />

        <div className='absolute left-1/2 top-[28px] flex -translate-x-1/2 items-center justify-center font-rokkitt text-5xl text-custom-style-3-1'>
          <div className='mr-1 min-w-14 text-end'>0{minute}</div>
          <div>:</div>
          <div className='ml-1 min-w-14'>{second < 10 ? `0${second}` : second}</div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.url === nextProps.url &&
      prevProps.time === nextProps.time &&
      prevProps.routeGoToBack === nextProps.routeGoToBack
    );
  },
);

interface CountdownForShootingProps {
  url: string;
  time: number;
  handleActionShootingByMethod: () => void;
}

export const CountdownForShooting = React.memo(
  function CountdownForShooting({ url, time, handleActionShootingByMethod }: CountdownForShootingProps) {
    const [timeLeft, setTimeLeft] = useState<number>(time);

    const minute = Math.floor(timeLeft / 60);
    const second = timeLeft % 60;

    useEffect(() => {
      if (timeLeft < 1) {
        setTimeout(() => {
          handleActionShootingByMethod();
          setTimeLeft(time);
        }, 500);
      }

      const id = setTimeout(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
      return () => {
        clearTimeout(id);
      };
    }, [timeLeft]);

    return (
      <div className='relative h-[85px] w-[160px]'>
        <DisplayImage src={url} />

        <div className='absolute left-1/2 top-[28px] flex -translate-x-1/2 items-center justify-center font-rokkitt text-5xl text-custom-style-3-1'>
          <div className='mr-1 min-w-14 text-end'>0{minute}</div>
          <div>:</div>
          <div className='ml-1 min-w-14'>{second < 10 ? `0${second}` : second}</div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.url === nextProps.url &&
      prevProps.time === nextProps.time &&
      prevProps.handleActionShootingByMethod === nextProps.handleActionShootingByMethod
    );
  },
);
