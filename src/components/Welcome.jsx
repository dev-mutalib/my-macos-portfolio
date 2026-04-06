import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef } from 'react';

const FONT_WEIGHTS = {
  subTitle: { min: 100, max: 400, default: 100 },
  title: { min: 400, max: 900, default: 400 },
};

const renderText = (text, className, baseWeight = 400) => {
  return [...text].map((char, index) => (
    <span
      key={index}
      className={className}
      style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));
};

const setupTextHover = (container, type) => {
  if (!container) return;

  const letters = container.querySelectorAll('span');
  const { min, max, default: base } = FONT_WEIGHTS[type];

  const animateLetter = (letter, weight, duration = 0.25) => {
    return gsap.to(letter, {
      fontVariationSettings: `'wght' ${weight}`,
      duration,
      ease: 'power2.out',
    });
  };

  let rafId;
  let pendingClientX = null;
  let cachedCenters = [];
  let containerLeft = 0;

  const updateCache = () => {
    const rect = container.getBoundingClientRect();
    containerLeft = rect.left;
    cachedCenters = Array.from(letters).map((letter) => {
      const lRect = letter.getBoundingClientRect();
      return lRect.left - containerLeft + lRect.width / 2;
    });
  };

  updateCache();
  window.addEventListener('resize', updateCache);

  const render = () => {
    if (pendingClientX === null) {
      rafId = null;
      return;
    }
    const mouseX = pendingClientX - containerLeft;
    pendingClientX = null;

    letters.forEach((letter, i) => {
      const distance = Math.abs(mouseX - cachedCenters[i]);
      const intensity = Math.exp(-(distance ** 2) / 2000);

      animateLetter(letter, min + (max - intensity) * intensity);
    });

    rafId = null;
  };

  const handleMouseMoveEvent = (e) => {
    pendingClientX = e.clientX;
    if (!rafId) {
      rafId = requestAnimationFrame(render);
    }
  };

  const handleMouseLeaveEvent = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    pendingClientX = null;
    letters.forEach((letter) => {
      animateLetter(letter, base);
    });
  };

  container.addEventListener('mousemove', handleMouseMoveEvent);
  container.addEventListener('mouseleave', handleMouseLeaveEvent);

  return () => {
    window.removeEventListener('resize', updateCache);
    if (rafId) cancelAnimationFrame(rafId);
    container.removeEventListener('mousemove', handleMouseMoveEvent);
    container.removeEventListener('mouseleave', handleMouseLeaveEvent);
  };
};

const Welcome = () => {
  const titleRef = useRef(null);
  const subTitleRef = useRef(null);

  useGSAP(() => {
    const titleCleanup = setupTextHover(titleRef.current, 'title');
    const subTitleCleanup = setupTextHover(subTitleRef.current, 'subTitle');

    return () => {
      titleCleanup?.();
      subTitleCleanup?.();
    };
  }, []);

  return (
    <section id='welcome'>
      <p ref={subTitleRef}>
        {renderText(
          `Hey, I'm Abdul Mutalib! Welcome to my`,
          'text-3xl font-georama',
          100,
        )}
      </p>
      <h1
        ref={titleRef}
        className='mt-7'
      >
        {renderText('Portfolio', 'text-9xl italic font-georama')}
      </h1>

      <div className='small-screen'>
        <p>This Profolio is designed for desktop/tablet screens only</p>
      </div>
    </section>
  );
};

export default Welcome;
