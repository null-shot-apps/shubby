'use client';

import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function ChristmasNewYearCountdown() {
  const [christmasTime, setChristmasTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [newYearTime, setNewYearTime] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [notificationGranted, setNotificationGranted] = useState(false);
  const [christmasPassed, setChristmasPassed] = useState(false);
  const [newYearPassed, setNewYearPassed] = useState(false);

  const calculateTimeLeft = (targetDate: Date): TimeLeft => {
    const now = new Date().getTime();
    const target = targetDate.getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    };
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationGranted(permission === 'granted');
    } else if (Notification.permission === 'granted') {
      setNotificationGranted(true);
    }
  };

  const showNotification = (title: string, body: string) => {
    if (notificationGranted && 'Notification' in window) {
      new Notification(title, {
        body,
        icon: '🎄',
        badge: '🎉'
      });
    }
  };

  useEffect(() => {
    requestNotificationPermission();

    const updateCountdowns = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      
      // Christmas date (December 25)
      let christmas = new Date(currentYear, 11, 25, 0, 0, 0);
      if (now > christmas) {
        christmas = new Date(currentYear + 1, 11, 25, 0, 0, 0);
        setChristmasPassed(true);
      }

      // New Year date (January 1)
      let newYear = new Date(currentYear + 1, 0, 1, 0, 0, 0);
      if (now > newYear) {
        setNewYearPassed(true);
      }

      const christmasTimeLeft = calculateTimeLeft(christmas);
      const newYearTimeLeft = calculateTimeLeft(newYear);

      setChristmasTime(christmasTimeLeft);
      setNewYearTime(newYearTimeLeft);

      // Check if we just hit Christmas
      if (christmasTimeLeft.days === 0 && christmasTimeLeft.hours === 0 && 
          christmasTimeLeft.minutes === 0 && christmasTimeLeft.seconds === 0 && !christmasPassed) {
        showNotification('🎄 Merry Christmas! 🎄', 'Wishing you joy and happiness!');
        setChristmasPassed(true);
      }

      // Check if we just hit New Year
      if (newYearTimeLeft.days === 0 && newYearTimeLeft.hours === 0 && 
          newYearTimeLeft.minutes === 0 && newYearTimeLeft.seconds === 0 && !newYearPassed) {
        showNotification('🎉 Happy New Year! 🎉', 'Welcome to a new year full of possibilities!');
        setNewYearPassed(true);
      }
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);

    return () => clearInterval(interval);
  }, [notificationGranted, christmasPassed, newYearPassed]);

  const CountdownCard = ({ title, time, emoji, gradient }: { title: string; time: TimeLeft; emoji: string; gradient: string }) => (
    <div className={`relative backdrop-blur-md bg-white/10 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl ${gradient}`}>
      <div className="text-center mb-6">
        <div className="text-6xl md:text-8xl mb-4 animate-bounce-slow">{emoji}</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h2>
      </div>
      
      <div className="grid grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Days', value: time.days },
          { label: 'Hours', value: time.hours },
          { label: 'Minutes', value: time.minutes },
          { label: 'Seconds', value: time.seconds }
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 mb-2 border border-white/30">
              <div className="text-3xl md:text-5xl font-bold text-white tabular-nums">
                {String(item.value).padStart(2, '0')}
              </div>
            </div>
            <div className="text-sm md:text-base text-white/80 font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-red-900 via-green-900 to-blue-900">
      {/* Snowflakes */}
      <div className="snowflakes" aria-hidden="true">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="snowflake" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${10 + Math.random() * 20}s`,
            opacity: Math.random() * 0.7 + 0.3,
            fontSize: `${Math.random() * 10 + 10}px`
          }}>
            ❄
          </div>
        ))}
      </div>

      {/* Festive lights overlay */}
      <div className="absolute inset-0 bg-festive-lights opacity-30" />
      
      {/* Main content */}
      <main className="relative z-10 h-full flex flex-col items-center justify-center px-4 md:px-6 py-8 overflow-y-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-4 drop-shadow-2xl animate-pulse-slow">
          🎄 Holiday Countdown 🎉
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 text-center mb-12 max-w-2xl">
          Count down to the most magical times of the year!
        </p>

        <div className="w-full max-w-6xl space-y-8">
          <CountdownCard 
            title="Christmas" 
            time={christmasTime} 
            emoji="🎄"
            gradient="bg-gradient-to-br from-red-500/20 to-green-500/20"
          />
          
          <CountdownCard 
            title="New Year" 
            time={newYearTime} 
            emoji="🎉"
            gradient="bg-gradient-to-br from-blue-500/20 to-purple-500/20"
          />
        </div>

        {!notificationGranted && (
          <button
            onClick={requestNotificationPermission}
            className="mt-8 px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold rounded-full border border-white/30 transition-all duration-300 hover:scale-105 shadow-xl"
          >
            🔔 Enable Notifications
          </button>
        )}
      </main>
    </div>
  );
}

