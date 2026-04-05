import React from 'react';
import dayjs from 'dayjs';
import { navIcons, navLinks } from '@constants';

const Navbar = () => {
  return (
    <>
      <nav>
        <div>
          <img
            src='/images/logo.svg'
            alt='apple-logo'
          />
          <p className='font-bold'>Abdul's Portfolio</p>

          <ul>
            {navLinks.map(({ id, name }) => (
              <li key={id}>
                <p>{name}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ul>
            {navIcons.map(({ id, img }) => (
              <li key={id}>
                <img
                  src={img}
                  alt={`icon-${id}`}
                />
              </li>
            ))}
          </ul>

          <time>{dayjs().format('DD MMMM YYYY   h:mm a')}</time>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
