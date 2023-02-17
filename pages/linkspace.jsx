import Image from 'next/image';
import supabaseIMG from '../public/projects/linkspaceapp.png';
import { RiArrowLeftSLine, RiRadioButtonFill } from 'react-icons/ri';
import Link from 'next/link';
import Head from 'next/head';
const LinkSpace = () => {
  return (
    <div className="w-full">
      <Head>
        <title>André Pichardo | LinkSpaceApp</title>
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
          src={supabaseIMG}
          alt=""
        />
        <div className="absolute text-white p-2 z-10 top-[70%] px-5 xs:px-10 xl:px-0 max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%]">
          <h2 className="py-2">LinkSpaceApp</h2>
          <h3>NextJS / Tailwind / Supabase </h3>
        </div>
      </div>

      <div className="max-w-[1240px] mb-4 mx-auto py-2 px-5 xs:px-10 xl:px-0 grid md:grid-cols-7 gap-8 pt-4">
        <div className="col-span-5 flex flex-col gap-3 text-justify">
          <h2 className="mb-2">Overview</h2>
          <p>
            A nice Link-management app inspired by <i>Linktree</i>. This app was
            built using NextJS and TailwindCSS for the frontend, and Supabase as
            backend technology. Users are able to create an account with a
            unique username. As soon as you sign in, you will be able to create
            your personal links by entering the <i>Link Name</i> & <i>URL</i>,
            and of course, upload your own <i>Profile Picture</i>. Share your
            profile&apos;s URL to anyone so they can access all your important
            links.
          </p>
          <div className="flex w-full flex-wrap gap-4 items-center justify-center xs:justify-start mt-4">
            <a
              href="https://link-space.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="px-8 py-2 w-full hover:opacity-80 transition-all">
                DEMO
              </button>
            </a>
            <a
              href="https://github.com/andrepichardo/linktree-clone"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="px-8 py-2 w-full hover:opacity-80 transition-all">
                CODE
              </button>
            </a>
          </div>
        </div>
        <div className="col-span-5 md:col-span-2 shadow-xl rounded-xl shadow-gray-400 p-4">
          <div className="p-2">
            <p className="text-center font-bold pb-2">Technologies</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1">
              <p className="text-gray-600 py-2 flex items-center gap-1">
                <RiRadioButtonFill className="shrink-0" />
                NextJS
              </p>
              <p className="text-gray-600 py-2 flex items-center gap-1">
                <RiRadioButtonFill className="shrink-0" />
                Tailwind
              </p>
              <p className="text-gray-600 py-2 flex items-center gap-1">
                <RiRadioButtonFill className="shrink-0" />
                Supabase
              </p>
              <p className="text-gray-600 py-2 flex items-center gap-1">
                <RiRadioButtonFill className="shrink-0" />
                TypeScript
              </p>
            </div>
          </div>
        </div>
        <Link href="/#projects">
          <span className="hover:underline  flex items-center underline-offset-4 py-1 cursor-pointer">
            <RiArrowLeftSLine />
            Back
          </span>
        </Link>
      </div>
    </div>
  );
};

export default LinkSpace;
