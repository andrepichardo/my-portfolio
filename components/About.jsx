import Image from 'next/image';
import Link from 'next/link';
import andrePP from '../public/assets/LosCacaosPP.jpg';
import { FiChevronDown } from 'react-icons/fi';

const About = () => {
  return (
    <div
      id="about"
      className="w-full md:min-h-screen h-full border-b-2 dark:border-[#2a374a] flex items-center py-24"
    >
      <div className="max-w-[1240px] px-5 xs:px-10 xl:px-0 m-auto md:grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <p className="uppercase text-xl tracking-widest text-[#5651e5]">
            About
          </p>
          <h2 className="py-4">Who I Am</h2>
          <p className="py-2 text-justify font-light text-[17px] text-black dark:text-[#ecf0f3] transition-all duration-300">
            Graduated as an Electronics and Communications engineer in 2019, my
            career as a programmer began that same year when I started working
            as a QA Software Tester for a local telecom company. There I started
            learning HTML, CSS and Javascript to fix some minor UI and
            programming issues in some of their projects. Some time later in
            2021, I officially got my first job as a frontend developer at the
            company I currently work for. In my spare time, I like to play
            videogames, exercise, watch movies and hang out with friends.
          </p>
          <p className="py-2 text-justify font-light text-[17px] text-black dark:text-[#ecf0f3] transition-all duration-300">
            I am concentrated on building awesome web applications that connect
            with API&apos;s and other backend technologies. Though I am most
            proficient in creating websites using primarily React with Next.js,
            TailwindCSS and MongoDB, I am a quick learner and can pick up new
            tech stacks as needed. I believe that being a great developer is not
            using one specific language, but choosing the best tool for the job.
            At the moment, focused on front-end development, while learning
            back-end technologies.
          </p>
          <Link
            className="flex w-fit items-center text-gray-600 dark:text-[#abb8c2] hover:text-gray-400 dark:hover:text-[#78848d] transition-all duration-300"
            href="/#projects"
          >
            <p className="py-2 underline underline-offset-2 text-sm md:text-base cursor-pointer">
              Check out some of my latest projects.
            </p>
            <FiChevronDown />
          </Link>
        </div>
        <div className="w-full h-auto m-auto shadow-xl shadow-gray-400 dark:shadow-gray-900/80 rounded-xl flex items-center justify-center p-4 hover:scale-105 ease-in duration-300">
          <Image className="rounded-md w-full" src={andrePP} alt="Andre" />
        </div>
      </div>
    </div>
  );
};

export default About;
