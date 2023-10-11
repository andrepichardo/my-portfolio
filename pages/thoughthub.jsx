import Image from 'next/image';
import ThoughthubIMG from '../public/projects/thoughthub.png';
import { RiArrowLeftSLine, RiRadioButtonFill } from 'react-icons/ri';
import Link from 'next/link';
import Head from 'next/head';
const Thoughthub = () => {
  return (
    <div className="w-full">
      <Head>
        <title>André Pichardo | ThoughtHub</title>
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
          src={ThoughthubIMG}
          alt=""
        />
        <div className="absolute text-white p-2 z-10 top-[70%] px-5 xs:px-10 xl:px-0 max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%]">
          <h2 className="py-2">ThoughtHub</h2>
          <h3>NextJS / PostgreSQL / Prisma </h3>
        </div>
      </div>

      <div className="max-w-[1240px] mb-4 mx-auto py-2 px-5 xs:px-10 xl:px-0 grid md:grid-cols-7 gap-8 pt-4">
        <div className="flex flex-col col-span-5 gap-3 text-justify">
          <h2 className="mb-2">Overview</h2>
          <p>
            A fullstack thoughts sharing app built in React with Next.js,
            TailwindCSS, PostgreSQL, Prisma & Next Auth. Users are able to add
            posts into the timeline with a max of 300 characters per posts,
            access to their own profile page to manage all your posts,
            edit/delete options for any of your posts, and the ability to add
            comments to any post you want.
          </p>
          <div className="flex flex-wrap items-center justify-center w-full gap-4 mt-4 xs:justify-start">
            <a
              href="https://thought-hub.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="w-full px-8 py-2">DEMO</button>
            </a>
            <a
              href="https://github.com/andrepichardo/thoughthub"
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
                HeadlessUI
              </p>
              <p className="text-gray-600 dark:text-[#ecf0f3] transition-all py-2 flex items-center gap-1">
                <RiRadioButtonFill className="shrink-0" />
                PostgreSQL
              </p>
              <p className="text-gray-600 dark:text-[#ecf0f3] transition-all py-2 flex items-center gap-1">
                <RiRadioButtonFill className="shrink-0" />
                React Query
              </p>
              <p className="text-gray-600 dark:text-[#ecf0f3] transition-all py-2 flex items-center gap-1">
                <RiRadioButtonFill className="shrink-0" />
                TypeScript
              </p>
              <p className="text-gray-600 dark:text-[#ecf0f3] transition-all py-2 flex items-center gap-1">
                <RiRadioButtonFill className="shrink-0" />
                Prisma
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

export default Thoughthub;
