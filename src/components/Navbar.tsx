'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { FaSpinner } from 'react-icons/fa';
import { BsMoon, BsSun } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SocialIcon from './SocialIcon';
import type { SocialLinkItem } from '@/lib/content-defaults';

interface NavbarProps {
  /** Managed in the CMS; the layout fetches them and passes them down. */
  links: SocialLinkItem[];
}

const Navbar = ({ links }: NavbarProps) => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [nav, setNav] = useState(false);
  const [shadow, setShadow] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isProjectPage = pathname.startsWith('/projects/');

  useEffect(() => {
    const handleShadow = () => {
      const threshold = isProjectPage ? 0.3 : 0.07;
      if (window.scrollY >= window.innerHeight * threshold) {
        setShadow(true);
        setScrolled(true);
      } else {
        setShadow(false);
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleShadow);
    return () => window.removeEventListener('scroll', handleShadow);
  }, [isProjectPage]);

  const handleNav = () => {
    setNav(!nav);
  };

  // Keyboard equivalent for the icon/div triggers below, which can't be real
  // <button> elements without inheriting the global gradient button style.
  const onActivateKey =
    (action: () => void) => (e: React.KeyboardEvent<SVGElement | HTMLElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        action();
      }
    };

  useEffect(() => {
    if (nav) {
      document.documentElement.style.overflowY = 'hidden';
    } else {
      document.documentElement.style.overflowY = 'auto';
    }
    return () => {
      document.documentElement.style.overflowY = 'auto';
    };
  }, [nav]);

  useEffect(() => {
    if (!nav) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNav(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [nav]);

  const renderThemeChanger = () => {
    if (!mounted) return <FaSpinner className="animate-spin" />;
    const currentTheme = theme === 'system' ? systemTheme : theme;
    if (currentTheme === 'dark') {
      return (
        <BsSun
          className="w-6 h-6 text-[#5651e5] hover:text-[#807cf2] transition-all active:scale-90"
          role="button"
          tabIndex={0}
          aria-label="Switch to light theme"
          onClick={() => setTheme('light')}
          onKeyDown={onActivateKey(() => setTheme('light'))}
        />
      );
    }
    return (
      <BsMoon
        className="w-6 h-6 text-[#5651e5] hover:text-[#9592f3] transition-all active:scale-90"
        role="button"
        tabIndex={0}
        aria-label="Switch to dark theme"
        onClick={() => setTheme('dark')}
        onKeyDown={onActivateKey(() => setTheme('dark'))}
      />
    );
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#about', label: 'About' },
    { href: '/#skills', label: 'Skills' },
    { href: '/#projects', label: 'Projects' },
    { href: '/resume', label: 'Resume' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <div
      className={`fixed w-full h-20 z-100 transition-all duration-300 ${
        shadow ? 'shadow-xl dark:shadow-[#0b1120]/50' : ''
      } ${
        isProjectPage && !scrolled
          ? 'bg-transparent'
          : 'bg-[#ecf0f3] dark:bg-[#1f2937]'
      }`}
    >
      <div className="flex justify-between items-center max-w-437.5 mx-auto w-full h-full px-6 2xl:px-16">
        <Link href="/">
          <Image
            className="cursor-pointer"
            src="/assets/AP-Logo2.svg"
            alt="Logo"
            width={75}
            height={50}
          />
        </Link>
        <div className="flex items-center gap-10">
          {renderThemeChanger()}
          <ul
            className={`hidden md:flex gap-10 transition-all ${
              isProjectPage && !scrolled
                ? 'text-[#ecf0f3]'
                : 'text-[#1f2937] dark:text-[#ecf0f3]'
            }`}
          >
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm uppercase group">
                  {link.label}
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-blue-400"></span>
                </Link>
              </li>
            ))}
          </ul>
          <div
            onClick={handleNav}
            onKeyDown={onActivateKey(handleNav)}
            role="button"
            tabIndex={0}
            aria-label="Open navigation menu"
            aria-expanded={nav}
            className={`md:hidden cursor-pointer transition-all duration-300 ${
              isProjectPage && !scrolled
                ? 'text-[#ecf0f3]'
                : 'text-[#1f2937] dark:text-[#ecf0f3]'
            }`}
          >
            <AiOutlineMenu size={28} />
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={
          nav
            ? 'fixed left-0 top-0 w-full h-full min-h-screen bg-black/60 transition-all duration-500'
            : 'fixed left-0 top-0 w-full h-full min-h-screen bg-none transition-all duration-500 invisible'
        }
      >
        <div className="flex">
          <div
            className={
              nav
                ? 'fixed left-0 top-0 w-[75%] sm:w-[60%] md:w-[45%] lg:w-[30%] xl:w-[25%] flex flex-col overflow-y-auto bg-[#ecf0f3] dark:bg-[#1f2937] h-full min-h-full px-5 pt-5 pb-8 xs:px-10 transition-all duration-1000'
                : 'fixed -left-full top-0 w-[75%] sm:w-[60%] md:w-[45%] lg:w-[30%] xl:w-[25%] flex flex-col overflow-y-auto bg-[#ecf0f3] dark:bg-[#1f2937] h-full min-h-full px-5 pt-5 pb-8 xs:px-10 transition-all duration-1000'
            }
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <Link onClick={() => setNav(false)} href="/">
                  <Image
                    className="cursor-pointer"
                    src="/assets/AP-Logo2.svg"
                    alt="Logo"
                    width={80}
                    height={45}
                  />
                </Link>
                <div
                  onClick={handleNav}
                  onKeyDown={onActivateKey(handleNav)}
                  role="button"
                  tabIndex={0}
                  aria-label="Close navigation menu"
                  className="rounded-full shadow-lg shadow-gray-400 dark:shadow-gray-900/80 text-[#1f2937] dark:text-[#ecf0f3] p-3 cursor-pointer active:scale-95 transition-all"
                >
                  <AiOutlineClose />
                </div>
              </div>
              <div className="border-b border-gray-300 text-[#1f2937] dark:text-[#ecf0f3] transition-all my-4">
                <p className="w-full py-4 text-sm xs:text-base">
                  Let&apos;s build something together!
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-between h-full gap-8 xs:mb-0">
              <ul className="flex flex-col gap-1 uppercase">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setNav(false)}
                      className="block py-4 text-sm rounded-md text-black dark:text-[#ecf0f3] dark:hover:text-[#5651e5] hover:text-[#5651e5] transition-all"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div>
                <p className="uppercase tracking-widest text-[#5651e5]">
                  Let&apos;s Connect
                </p>
                <div className="flex flex-wrap items-center justify-between w-full gap-2 mt-4">
                  {links.map((link) => {
                    const internal = link.url.startsWith('/');
                    const circle = (
                      <div className="p-4 duration-300 ease-in rounded-full shadow-lg cursor-pointer shadow-gray-400 dark:shadow-gray-900 xs:p-5 hover:scale-110">
                        <SocialIcon
                          icon={link.icon}
                          className="w-5 h-5 text-blue-800"
                        />
                      </div>
                    );

                    return internal ? (
                      <Link
                        key={link.id}
                        className="rounded-full"
                        onClick={() => setNav(false)}
                        href={link.url}
                        aria-label={link.label}
                      >
                        {circle}
                      </Link>
                    ) : (
                      <a
                        key={link.id}
                        className="rounded-full"
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={link.label}
                      >
                        {circle}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={handleNav}
          aria-hidden="true"
          className={
            nav
              ? 'w-full h-full min-h-screen'
              : 'w-full h-full min-h-screen hidden'
          }
        ></div>
      </div>
    </div>
  );
};

export default Navbar;
