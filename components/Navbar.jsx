import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import logo from '../public/assets/AP-Logo2.svg';
import { AiOutlineClose, AiOutlineMail, AiOutlineMenu } from 'react-icons/ai';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { BsMoon, BsPersonLinesFill, BsSun } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Navbar = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderThemeChanger = () => {
    if (!mounted) return null;

    const currentTheme = theme == 'system' ? systemTheme : theme;

    if (currentTheme == 'dark') {
      return (
        <BsSun
          className="w-6 h-6 text-[#5651e5] hover:text-[#807cf2] transition-all active:scale-90"
          role="button"
          onClick={() => setTheme('light')}
        />
      );
    } else {
      return (
        <BsMoon
          className="w-6 h-6 text-[#5651e5] hover:text-[#9592f3] transition-all active:scale-90"
          role="button"
          onClick={() => setTheme('dark')}
        />
      );
    }
  };

  const [nav, setNav] = useState(false);
  const [shadow, setShadow] = useState(false);
  const [navBg, setNavBg] = useState('#ecf0f3');
  const [linkColor, setLinkColor] = useState('#1f2937');
  const router = useRouter();

  useEffect(() => {
    if (
      router.asPath === '/gifexpert' ||
      router.asPath === '/linkspace' ||
      router.asPath === '/becas'
    ) {
      setNavBg('transparent');
      setLinkColor('#ecf0f3');
    } else {
      setNavBg('#ecf0f3');
      setLinkColor('#1f2937');
    }
  }, [router]);

  const handleNav = () => {
    setNav(!nav);
  };

  if (typeof window !== 'undefined') {
    if (nav === true) {
      document.documentElement.style.overflowY = 'hidden';
    } else {
      document.documentElement.style.overflowY = 'auto';
    }
  }

  useEffect(() => {
    if (
      router.asPath === '/gifexpert' ||
      router.asPath === '/linkspace' ||
      router.asPath === '/becas'
    ) {
      const handleShadow = () => {
        if (window.scrollY >= window.innerHeight * 0.3) {
          setShadow(true);
          setNavBg('#ecf0f3');
          setLinkColor('#1f2937');
        } else {
          setShadow(false);
          setNavBg('transparent');
          setLinkColor('#ecf0f3');
        }
      };
      window.addEventListener('scroll', handleShadow);
    } else {
      const handleShadow = () => {
        if (window.scrollY >= window.innerHeight * 0.07) {
          setShadow(true);
          setNavBg('#ecf0f3');
          setLinkColor('#1f2937');
        } else {
          setShadow(false);
          setNavBg('#ecf0f3');
          setLinkColor('#1f2937');
        }
      };
      window.addEventListener('scroll', handleShadow);
    }
  }, [router]);

  return (
    <div
      className={
        router.asPath === '/gifexpert' ||
        router.asPath === '/linkspace' ||
        router.asPath === '/becas'
          ? shadow
            ? `fixed w-full h-20 shadow-xl z-[100] bg-[${navBg}] dark:bg-[#1f2937] transition-all duration-300`
            : `fixed w-full h-20 z-[100] bg-[${navBg}] transition-all duration-300`
          : shadow
          ? `fixed w-full h-20 shadow-xl z-[100] bg-[${navBg}] dark:bg-[#1f2937] transition-all duration-300`
          : `fixed w-full h-20 z-[100] bg-[${navBg}] dark:bg-[#1f2937] transition-all duration-300`
      }
    >
      <div className="flex justify-between items-center max-w-[1750px] mx-auto w-full h-full px-6 2xl:px-16">
        <Link href="/">
          <Image
            className="cursor-pointer"
            src={logo}
            alt="Logo"
            width="75"
            height="50"
          />
        </Link>
        <div className="flex items-center gap-10">
          {renderThemeChanger()}
          <ul
            style={{ color: `${linkColor}` }}
            className={`hidden md:flex gap-10 dark:text-[#ecf0f3] transition-all duration-300`}
          >
            <Link href="/" className="group text-sm uppercase">
              Home
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-blue-400"></span>
            </Link>
            <Link href="/#about" className="group text-sm uppercase">
              About
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-blue-400"></span>
            </Link>
            <Link href="/#skills" className="group text-sm uppercase">
              Skills
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-blue-400"></span>
            </Link>
            <Link href="/#projects" className="group text-sm uppercase">
              Projects
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-blue-400"></span>
            </Link>
            <Link href="/resume" className="group text-sm uppercase">
              Resume
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-blue-400"></span>
            </Link>
            <Link href="/#contact" className="group text-sm uppercase">
              Contact
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-blue-400"></span>
            </Link>
          </ul>
          <div
            style={{ color: `${linkColor}` }}
            onClick={handleNav}
            className="md:hidden cursor-pointer dark:text-[#ecf0f3] transition-all duration-300"
          >
            <AiOutlineMenu size={28} />
          </div>
        </div>
      </div>

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
                ? 'fixed left-0 top-0 w-[75%] sm:w-[60%] md:w-[45%] lg:w-[30%] xl:w-[25%] flex flex-col overflow-y-auto bg-[#ecf0f3] dark:bg-[#1f2937] h-full min-h-full  px-5 pt-5 pb-8 xs:px-10 transition-all duration-1000'
                : 'fixed left-[-100%] top-0 w-[75%] sm:w-[60%] md:w-[45%] lg:w-[30%] xl:w-[25%] flex flex-col overflow-y-auto bg-[#ecf0f3] dark:bg-[#1f2937] h-full min-h-full px-5 pt-5 pb-8 xs:px-10 transition-all duration-1000'
            }
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <Link onClick={() => setNav(false)} href="/">
                  <Image
                    className="cursor-pointer"
                    src={logo}
                    alt="Logo"
                    width="80"
                    height="45"
                  />
                </Link>
                <div
                  onClick={handleNav}
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
            <div className=" flex flex-col justify-between gap-8 xs:mb-0 h-full">
              <ul className="uppercase flex flex-col gap-1">
                <Link href="/">
                  <li
                    onClick={() => setNav(false)}
                    className="py-4 text-sm rounded-md text-black dark:text-[#ecf0f3] dark:hover:text-[#5651e5] hover:text-[#5651e5] transition-all"
                  >
                    Home
                  </li>
                </Link>
                <Link href="/#about">
                  <li
                    onClick={() => setNav(false)}
                    className="py-4 text-sm rounded-md text-black dark:text-[#ecf0f3] dark:hover:text-[#5651e5] hover:text-[#5651e5] transition-all"
                  >
                    About
                  </li>
                </Link>
                <Link href="/#skills">
                  <li
                    onClick={() => setNav(false)}
                    className="py-4 text-sm rounded-md text-black dark:text-[#ecf0f3] dark:hover:text-[#5651e5] hover:text-[#5651e5] transition-all"
                  >
                    Skills
                  </li>
                </Link>
                <Link href="/#projects">
                  <li
                    onClick={() => setNav(false)}
                    className="py-4 text-sm rounded-md text-black dark:text-[#ecf0f3] dark:hover:text-[#5651e5] hover:text-[#5651e5] transition-all"
                  >
                    Projects
                  </li>
                </Link>
                <Link href="/resume">
                  <li
                    onClick={() => setNav(false)}
                    className="py-4 text-sm rounded-md text-black dark:text-[#ecf0f3] dark:hover:text-[#5651e5] hover:text-[#5651e5] transition-all"
                  >
                    Resume
                  </li>
                </Link>
                <Link href="/#contact">
                  <li
                    onClick={() => setNav(false)}
                    className="py-4 text-sm rounded-md text-black dark:text-[#ecf0f3] dark:hover:text-[#5651e5] hover:text-[#5651e5] transition-all"
                  >
                    Contact
                  </li>
                </Link>
              </ul>
              <div className="">
                <p className="uppercase tracking-widest text-[#5651e5]">
                  Let&apos;s Connect
                </p>
                <div className="flex items-center justify-between flex-wrap gap-2 mt-4 w-full">
                  <a
                    className="rounded-full"
                    href="https://www.linkedin.com/in/andre-pichardo/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="rounded-full shadow-lg shadow-gray-400 dark:shadow-gray-900 p-4 xs:p-5 cursor-pointer hover:scale-110 ease-in duration-300">
                      <FaLinkedinIn className="w-5 h-5 text-blue-800" />
                    </div>
                  </a>
                  <a
                    className="rounded-full"
                    href="https://github.com/andrepichardo"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="rounded-full shadow-lg shadow-gray-400 dark:shadow-gray-900 p-4 xs:p-5 cursor-pointer hover:scale-110 ease-in duration-300">
                      <FaGithub className="w-5 h-5 text-blue-800" />
                    </div>
                  </a>
                  <Link
                    className="rounded-full"
                    onClick={() => setNav(false)}
                    href="/#contact"
                  >
                    <div className="rounded-full shadow-lg shadow-gray-400 dark:shadow-gray-900 p-4 xs:p-5 cursor-pointer hover:scale-110 ease-in duration-300">
                      <AiOutlineMail className="w-5 h-5 text-blue-800" />
                    </div>
                  </Link>
                  <Link
                    className="rounded-full"
                    onClick={() => setNav(false)}
                    href="/resume"
                  >
                    <div className="rounded-full shadow-lg shadow-gray-400 dark:shadow-gray-900 p-4 xs:p-5 cursor-pointer hover:scale-110 ease-in duration-300">
                      <BsPersonLinesFill className="w-5 h-5 text-blue-800" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={handleNav}
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
