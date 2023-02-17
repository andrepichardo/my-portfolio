import Link from 'next/link';
import { AiOutlineMail } from 'react-icons/ai';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

const Main = () => {
  return (
    <div id="home" className="w-full border-b-2 h-screen text-center">
      <div className="max-w-[1240px] w-full mx-auto h-full flex justify-center items-center">
        <div className="flex flex-col gap-1">
          <p className="uppercase text-sm tracking-widest text-gray-600 mb-2">
            Let&apos;s build something together
          </p>
          <h1 className="py-0 text-gray-700">
            Hi, I&apos;m <span className="text-[#5651e5]">André</span>
          </h1>
          <h1 className=" text-gray-700 mb-3 px-3">
            A Front-End Web Developer
          </h1>
          <p className=" textgray-600 max-w-[90%] md:max-w-[60%] m-auto font-thin text-black">
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
              <div className="rounded-full shadow-lg shadow-gray-400 p-5 xs:p-6 cursor-pointer hover:scale-110 ease-in duration-300">
                <FaLinkedinIn className="w-5 h-5 text-blue-800" />
              </div>
            </a>
            <a
              className="rounded-full"
              href="https://github.com/andrepichardo"
              target="_blank"
              rel="noreferrer"
            >
              <div className="rounded-full shadow-lg shadow-gray-400 p-5 xs:p-6 cursor-pointer hover:scale-110 ease-in duration-300">
                <FaGithub className="w-5 h-5 text-blue-800" />
              </div>
            </a>
            <Link className="rounded-full" href="/#contact">
              <div className="rounded-full shadow-lg shadow-gray-400 p-5 xs:p-6 cursor-pointer hover:scale-110 ease-in duration-300">
                <AiOutlineMail className="w-5 h-5 text-blue-800" />
              </div>
            </Link>
            <Link className="rounded-full" href="/resume">
              <div className="rounded-full shadow-lg shadow-gray-400 p-5 xs:p-6 cursor-pointer hover:scale-110 ease-in duration-300">
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
