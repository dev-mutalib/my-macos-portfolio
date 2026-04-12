import React, { useRef } from 'react';
import { dockApps } from '@constants';
import { Tooltip } from 'react-tooltip';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import useWindowStore from '@store/window.js';

const Dock = () => {
  const { openWindow, closeWindow, windows } = useWindowStore();
  const dockRef = useRef(null);

  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const icons = dock.querySelectorAll('.dock-icon');

    let rafId;

    const animatIcon = (clientX) => {
      const { left: dockLeft } = dock.getBoundingClientRect();

      icons.forEach((icon) => {
        const { left: iconLeft, width } = icon.getBoundingClientRect();
        const center = iconLeft - dockLeft + width / 2;
        const mouseX = clientX - dockLeft;
        const distance = Math.abs(mouseX - center);
        const intensity = Math.exp(-(distance ** 2) / 2000);

        gsap.to(icon, {
          scale: 1 + 0.25 * intensity,
          y: -15 * intensity,
          duration: 0.25,
          ease: 'power1.out',
        });
      });
    };

    const handleMouseMoveEvent = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => animatIcon(e.clientX));
    };

    const resetIcons = () => {
      if (rafId) cancelAnimationFrame(rafId);
      icons.forEach((icon) => {
        gsap.to(icon, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: 'power1.out',
        });
      });
    };
    dock.addEventListener('mousemove', handleMouseMoveEvent);
    dock.addEventListener('mouseleave', resetIcons);

    return () => {
      dock.removeEventListener('mousemove', handleMouseMoveEvent);
      dock.removeEventListener('mouseleave', resetIcons);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const toggleApp = (app) => {
    if (!app.canOpen) return;
    const win = windows[app.id];

    if (!win) return;

    if (win.isOpen) {
      closeWindow(app.id);
    } else {
      openWindow(app.id);
    }
  };

  return (
    <>
      <section id='dock'>
        <div
          ref={dockRef}
          className='dock-container'
        >
          {dockApps.map(({ id, name, icon, canOpen }) => (
            <div
              key={id ?? name}
              className='relative flex justify-center'
            >
              <button
                type='button'
                className='dock-icon'
                aria-label={name}
                data-tooltip-id='dock-tooltip'
                data-tooltip-content={name}
                data-tooltip-delay-show={150}
                disabled={!canOpen}
                onClick={() => toggleApp({ id, canOpen })}
              >
                <img
                  src={`/images/${icon}`}
                  alt={name}
                  loading='lazy'
                  className={canOpen ? '' : 'opacity-60'}
                />
              </button>
            </div>
          ))}
          <Tooltip
            id='dock-tooltip'
            place='top'
            className='tooltip'
          />
        </div>
      </section>
    </>
  );
};

export default Dock;
