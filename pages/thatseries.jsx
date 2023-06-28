import Image from 'next/image';
import thatseriesIMG from '../public/projects/thatseries.png';
import { RiArrowLeftSLine, RiRadioButtonFill } from 'react-icons/ri';
import Link from 'next/link';
import Head from 'next/head';
const LinkSpace = () => {
  return (
    <div className="w-full">
      <Head>
        <title>André Pichardo | ThatSeriesApp</title>
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
          src={thatseriesIMG}
          alt=""
        />
        <div className="absolute text-white p-2 z-10 top-[70%] px-5 xs:px-10 xl:px-0 max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%]">
          <h2 className="py-2">ThatSeriesApp</h2>
          <h3>NextJS / Tailwind / React Query </h3>
        </div>
      </div>

      <div className="max-w-[1240px] mb-4 mx-auto py-2 px-5 xs:px-10 xl:px-0 grid md:grid-cols-7 gap-8 pt-4">
        <div className="flex flex-col col-span-5 gap-3 text-justify">
          <h2 className="mb-2">Overview</h2>
          <p>
            A simple and friendly application built with Next.js that connects
            to the <i>EpisoDate API</i>, allowing users to search for and
            navigate through many TV shows. Users can also view detailed
            information about a specific TV show, including the release date,
            genre, episodes, and more. It is worth mentioning that this has a
            nice pagination, showing 20 results per query and keeping the
            information of the pages already seen cached, thanks to{' '}
            <i>React Query</i>.
          </p>
          <div className="flex flex-wrap items-center justify-center w-full gap-4 mt-4 xs:justify-start">
            <a
              href="https://thatseries-app.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="w-full px-8 py-2">DEMO</button>
            </a>
            <a
              href="https://github.com/andrepichardo/thatseries-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="w-full px-8 py-2">CODE</button>
            </a>
          </div>
        </div>
        <div className="col-span-5 p-4 shadow-xl md:col-span-2 h-fit rounded-xl shadow-gray-400 dark:shadow-gray-900/80">
          <div className="p-2">
            <p className="pb-2 font-bold text-center">Technologies</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1">
              <p className="text-gray-600 dark:text-[#ecf0f3] transition-all py-2 flex items-center gap-1">
                <RiRadioButtonFill className="shrink-0" />
                NextJS
              </p>
              <p className="text-gray-600 dark:text-[#ecf0f3] transition-all py-2 flex items-center gap-1">
                <RiRadioButtonFill className="shrink-0" />
                Tailwind
              </p>
              <p className="text-gray-600 dark:text-[#ecf0f3] transition-all py-2 flex items-center gap-1">
                <RiRadioButtonFill className="shrink-0" />
                DaisyUI
              </p>
              <p className="text-gray-600 dark:text-[#ecf0f3] transition-all py-2 flex items-center gap-1">
                <RiRadioButtonFill className="shrink-0" />
                React Query
              </p>
              <p className="text-gray-600 dark:text-[#ecf0f3] transition-all py-2 flex items-center gap-1">
                <RiRadioButtonFill className="shrink-0" />
                TypeScript
              </p>
            </div>
          </div>
        </div>
        <Link className="w-fit" href="/#projects">
          <span className="flex items-center py-1 cursor-pointer hover:underline underline-offset-4">
            <RiArrowLeftSLine />
            Back
          </span>
        </Link>
      </div>
    </div>
  );
};

export default LinkSpace;
