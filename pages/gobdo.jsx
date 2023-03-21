import Image from 'next/image';
import gobdo from '../public/projects/gobdo.png';
import { RiArrowLeftSLine, RiRadioButtonFill } from 'react-icons/ri';
import Link from 'next/link';
import Head from 'next/head';
const Gobdo = () => {
  return (
    <div className="w-full">
      <Head>
        <title>André Pichardo | Gob.do</title>
        <meta
          name="description"
          content="Dominican front-end web developer, specializing in building great digital experiences."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full h-[40vh] lg:h-[50vh] relative">
        <div className="absolute top-0 left-0 w-full h-[40vh] lg:h-[50vh] bg-black/80 z-10"></div>
        <Image
          className="absolute object-cover w-full h-[40vh] lg:h-[50vh]"
          src={gobdo}
          alt=""
        />
        <div className="absolute text-white p-2 z-10 top-[70%] px-5 xs:px-10 xl:px-0 max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%]">
          <h2 className="py-2">Gob.do Portal</h2>
          <h3>NextJS / Tailwind / React Query </h3>
        </div>
      </div>

      <div className="max-w-[1240px] mb-4 mx-auto py-2 px-5 xs:px-10 xl:px-0 grid md:grid-cols-7 gap-8 pt-4">
        <div className="col-span-5 flex flex-col gap-3 text-justify">
          <h2 className="mb-2">Overview</h2>
          <p>
            The official <i>Portal of Services of the Dominican Government</i>,
            a platform that brings together all the available services of the
            State in a digital way, to facilitate the citizen all the
            bureaucratic processes that correspond to each service. As expected,
            As expected, I worked on this project together with other great
            frontend and backend developers, which made this experience more
            enjoyable.
          </p>
          <p>
            <b>Note</b>: The repository of this project is private, since it
            belongs to the government of the Dominican Republic, so I
            couldn&apos;t share it here.
          </p>
          <div className="flex w-full flex-wrap gap-4 items-center justify-center xs:justify-start mt-4">
            <a
              href="https://www.gob.do/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="px-8 py-2 w-full">DEMO</button>
            </a>
          </div>
        </div>
        <div className="col-span-5 md:col-span-2 h-fit shadow-xl rounded-xl shadow-gray-400 dark:shadow-gray-900/80 p-4">
          <div className="p-2">
            <p className="text-center font-bold pb-2">Technologies</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1">
              <p className="text-gray-600 dark:text-[#ecf0f3] transition-all py-2 flex items-center gap-1">
                <RiRadioButtonFill className="shrink-0" />
                NextJS
              </p>
              <p className="text-gray-600 dark:text-[#ecf0f3] transition-all py-2 flex items-center gap-1">
                <RiRadioButtonFill className="shrink-0" />
                JavaScript
              </p>
              <p className="text-gray-600 dark:text-[#ecf0f3] transition-all py-2 flex items-center gap-1">
                <RiRadioButtonFill className="shrink-0" />
                Tailwind
              </p>
              <p className="text-gray-600 dark:text-[#ecf0f3] transition-all py-2 flex items-center gap-1">
                <RiRadioButtonFill className="shrink-0" />
                Headless UI
              </p>
              <p className="text-gray-600 dark:text-[#ecf0f3] transition-all py-2 flex items-center gap-1">
                <RiRadioButtonFill className="shrink-0" />
                React Query
              </p>
              <p className="text-gray-600 dark:text-[#ecf0f3] transition-all py-2 flex items-center gap-1">
                <RiRadioButtonFill className="shrink-0" />
                Docker
              </p>
            </div>
          </div>
        </div>
        <Link className="w-fit" href="/#projects">
          <span className="hover:underline flex items-center underline-offset-4 py-1 cursor-pointer">
            <RiArrowLeftSLine />
            Back
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Gobdo;
