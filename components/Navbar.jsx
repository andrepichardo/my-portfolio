import Image from 'next/image';
import Link from 'next/link';
import logo from '../public/assets/AP-Logo2.svg';
import { AiOutlineClose, AiOutlineMail, AiOutlineMenu } from 'react-icons/ai';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { BsPersonLinesFill } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [shadow, setShadow] = useState(false);
  const [navBg, setNavBg] = useState('#ecf0f3');
  const [linkColor, setLinkColor] = useState('#1f2937');
  const router = useRouter();

  useEffect(() => {
    if (router.asPath === '/gifexpert') {
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

  useEffect(() => {
    if (router.asPath === '/gifexpert') {
      const handleShadow = () => {
        setShadow(false);
      };
      window.addEventListener('scroll', handleShadow);
    } else {
      const handleShadow = () => {
        if (window.scrollY >= window.innerHeight * 0.07) {
          setShadow(true);
        } else {
          setShadow(false);
        }
      };
      window.addEventListener('scroll', handleShadow);
    }
  }, [router]);

  return (
    <div
      style={{ backgroundColor: `${navBg}` }}
      className={
        shadow
          ? 'fixed w-full h-20 shadow-xl z-[100]'
          : 'fixed w-full h-20 z-[100]'
      }
    >
      <div className="flex justify-between items-center w-full h-full px-6 2xl:px-16">
        <Link href="/">
          <Image
            className="cursor-pointer"
            src={logo}
            alt="/"
            width="75"
            height="50"
          />
        </Link>
        <div>
          <ul style={{ color: `${linkColor}` }} className="hidden md:flex">
            <Link href="/">
              <li className="ml-10 text-sm uppercase hover:transition-all border-b-2 border-transparent hover:border-blue-400 transition-all">
                Home
              </li>
            </Link>
            <Link href="/#about">
              <li className="ml-10 text-sm uppercase hover:transition-all border-b-2 border-transparent hover:border-blue-400 transition-all">
                About
              </li>
            </Link>
            <Link href="/#skills">
              <li className="ml-10 text-sm uppercase hover:transition-all border-b-2 border-transparent hover:border-blue-400 transition-all">
                Skills
              </li>
            </Link>
            <Link href="/#projects">
              <li className="ml-10 text-sm uppercase hover:transition-all border-b-2 border-transparent hover:border-blue-400 transition-all">
                Projects
              </li>
            </Link>
            <Link href="/#contact">
              <li className="ml-10 text-sm uppercase hover:transition-all border-b-2 border-transparent hover:border-blue-400 transition-all">
                Contact
              </li>
            </Link>
          </ul>
          <div
            style={{ color: `${linkColor}` }}
            onClick={handleNav}
            className="md:hidden cursor-pointer"
          >
            <AiOutlineMenu size={25} />
          </div>
        </div>
      </div>

      <div
        className={
          nav ? 'md:hidden fixed left-0 top-0 w-full h-full bg-black/60' : ''
        }
      >
        <div
          className={
            nav
              ? 'md:hidden fixed left-0 top-0 w-[75%] sm:w-[60%] md:w-[45%] h-full bg-[#ecf0f3] p-5 xs:p-10 transition-all duration-1000'
              : 'fixed left-[-100%] top-0 w-[75%] sm:w-[60%] md:w-[45%] bg-[#ecf0f3] h-full p-5 xs:p-10 transition-all duration-1000'
          }
        >
          <div>
            <div className="flex items-center justify-between">
              <Link href="/">
                <Image
                  className="cursor-pointer"
                  src={logo}
                  alt="/"
                  width="80"
                  height="45"
                />
              </Link>
              <div
                onClick={handleNav}
                className="rounded-full shadow-lg shadow-gray-400 p-3 cursor-pointer active:scale-95 transition-all"
              >
                <AiOutlineClose />
              </div>
            </div>
            <div className="border-b border-gray-300 my-4">
              <p className="w-full py-4 text-sm xs:text-base">
                Let&apos;s build something together!
              </p>
            </div>
          </div>
          <div className="py-4 flex flex-col justify-between h-[80%] ">
            <ul className="uppercase flex flex-col gap-1 list-disc list-inside">
              <Link href="/">
                <li
                  onClick={() => setNav(false)}
                  className="py-4 text-sm hover:bg-[#a2b4d2] rounded-md pl-2"
                >
                  Home
                </li>
              </Link>
              <Link href="/#about">
                <li
                  onClick={() => setNav(false)}
                  className="py-4 text-sm hover:bg-[#a2b4d2] rounded-md pl-2"
                >
                  About
                </li>
              </Link>
              <Link href="/#skills">
                <li
                  onClick={() => setNav(false)}
                  className="py-4 text-sm hover:bg-[#a2b4d2] rounded-md pl-2"
                >
                  Skills
                </li>
              </Link>
              <Link href="/#projects">
                <li
                  onClick={() => setNav(false)}
                  className="py-4 text-sm hover:bg-[#a2b4d2] rounded-md pl-2"
                >
                  Projects
                </li>
              </Link>
              <Link href="/#contact">
                <li
                  onClick={() => setNav(false)}
                  className="py-4 text-sm hover:bg-[#a2b4d2] rounded-md pl-1.5"
                >
                  Contact
                </li>
              </Link>
            </ul>
            <div className="">
              <p className="uppercase tracking-widest text-[#5651e5]">
                Let&apos;s Connect
              </p>
              <div className="flex items-center justify-between gap-2 xs:gap-0 my-4 w-full">
                <a
                  href="https://www.linkedin.com/in/andre-pichardo/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="rounded-full shadow-lg shadow-gray-400 p-3 xs:p-5 cursor-pointer hover:scale-110 ease-in duration-300">
                    <FaLinkedinIn className="w-5 h-5 text-blue-800" />
                  </div>
                </a>
                <a
                  href="https://github.com/andrepichardo"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="rounded-full shadow-lg shadow-gray-400 p-3 xs:p-5 cursor-pointer hover:scale-110 ease-in duration-300">
                    <FaGithub className="w-5 h-5 text-blue-800" />
                  </div>
                </a>
                <div className="rounded-full shadow-lg shadow-gray-400 p-3 xs:p-5 cursor-pointer hover:scale-110 ease-in duration-300">
                  <AiOutlineMail className="w-5 h-5 text-blue-800" />
                </div>
                <div className="rounded-full shadow-lg shadow-gray-400 p-3 xs:p-5 cursor-pointer hover:scale-110 ease-in duration-300">
                  <BsPersonLinesFill className="w-5 h-5 text-blue-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
