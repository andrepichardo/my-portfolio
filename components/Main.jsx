import Link from 'next/link';
import { AiOutlineMail } from 'react-icons/ai';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

const Main = () => {
  return (
    <div
      id="home"
      className="w-full border-b-2 dark:border-[#2a374a] h-screen text-center"
    >
      <div className="max-w-[1240px] w-full mx-auto h-full flex justify-center items-center">
        <div className="flex flex-col gap-1">
          <p className="uppercase text-sm tracking-widest text-gray-600 dark:text-[#ecf0f3] transition-all mb-2">
            Let&apos;s build something together
          </p>
          <h1 className="py-0 text-gray-700 dark:text-[#ecf0f3] transition-all">
            Hi, I&apos;m <span className="text-[#5651e5]">André</span>
          </h1>
          <h1 className=" text-gray-700 dark:text-[#ecf0f3] transition-all  mb-3 px-3">
            A Front-End Web Developer
          </h1>
          <p className="text-gray-600 dark:text-[#ecf0f3] transition-all max-w-[90%] md:max-w-[60%] m-auto font-light">
            I&apos;m a 25 years old dominican front-end web developer,
            specializing in building (and occasionally designing) great digital
            experiences.
          </p>
          <div className="flex items-center justify-around w-full gap-1 xs:gap-4 max-w-[330px] m-auto mt-3">
            <a
              className="rounded-full"
              href="https://www.linkedin.com/in/andre-pichardo/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="p-5 duration-300 ease-in rounded-full shadow-lg cursor-pointer shadow-gray-400 dark:shadow-gray-900 xs:p-6 hover:scale-110">
                <FaLinkedinIn className="w-5 h-5 text-blue-800" />
              </div>
            </a>
            <a
              className="rounded-full"
              href="https://github.com/andrepichardo"
              target="_blank"
              rel="noreferrer"
            >
              <div className="p-5 duration-300 ease-in rounded-full shadow-lg cursor-pointer shadow-gray-400 dark:shadow-gray-900 xs:p-6 hover:scale-110">
                <FaGithub className="w-5 h-5 text-blue-800" />
              </div>
            </a>
            <Link className="rounded-full" href="/#contact">
              <div className="p-5 duration-300 ease-in rounded-full shadow-lg cursor-pointer shadow-gray-400 dark:shadow-gray-900 xs:p-6 hover:scale-110">
                <AiOutlineMail className="w-5 h-5 text-blue-800" />
              </div>
            </Link>
            <Link className="rounded-full" href="/resume">
              <div className="p-5 duration-300 ease-in rounded-full shadow-lg cursor-pointer shadow-gray-400 dark:shadow-gray-900 xs:p-6 hover:scale-110">
                <BsFillPersonLinesFill className="w-5 h-5 text-blue-800" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
