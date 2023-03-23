import Image from 'next/image';
import html from '../public/assets/skills/html.png';
import css from '../public/assets/skills/css.png';
import javascript from '../public/assets/skills/javascript.png';
import react from '../public/assets/skills/react.png';
import next from '../public/assets/skills/nextjs.png';
import tailwind from '../public/assets/skills/tailwind.png';
import materialUI from '../public/assets/skills/material-ui.svg';
import supabase from '../public/assets/skills/supabase.svg';

const Skills = () => {
  return (
    <div
      id="skills"
      className="w-full border-b-2 dark:border-[#2a374a] md:h-screen py-24"
    >
      <div className="max-w-[1240px] px-5 xs:px-10 xl:px-0 mx-auto flex flex-col justify-center h-full">
        <p className="uppercase text-xl tracking-widest text-[#5651e5]">
          Skills
        </p>
        <h2 className="py-4">What I Can Do</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 flex justify-center shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105 ease-in duration-300">
            <div className="grid grid-cols-2 gap-4 w-full justify-center items-center">
              <div className="m-auto flex">
                <Image src={html} width={64} height={64} alt="HTML" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3>HTML</h3>
              </div>
            </div>
          </div>
          <div className="p-6 flex justify-center shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105 ease-in duration-300">
            <div className="grid grid-cols-2 gap-4 w-full justify-center items-center">
              <div className="m-auto flex">
                <Image src={css} width={64} height={64} alt="CSS" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3>CSS</h3>
              </div>
            </div>
          </div>
          <div className="p-6 flex justify-center shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105 ease-in duration-300">
            <div className="grid grid-cols-2 gap-4 w-full justify-center items-center">
              <div className="m-auto flex">
                <Image src={javascript} width={64} height={64} alt="JS" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3>Javascript</h3>
              </div>
            </div>
          </div>
          <div className="p-6 flex justify-center shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105 ease-in duration-300">
            <div className="grid grid-cols-2 gap-4 w-full justify-center items-center">
              <div className="m-auto flex">
                <Image src={react} width={64} height={64} alt="React" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3>React</h3>
              </div>
            </div>
          </div>
          <div className="p-6 flex justify-center shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105 ease-in duration-300">
            <div className="grid grid-cols-2 gap-4 w-full justify-center items-center">
              <div className="m-auto flex">
                <Image src={next} width={64} height={64} alt="Next" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3>NextJS</h3>
              </div>
            </div>
          </div>
          <div className="p-6 flex justify-center shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105 ease-in duration-300">
            <div className="grid grid-cols-2 gap-4 w-full justify-center items-center">
              <div className="m-auto flex">
                <Image src={tailwind} width={64} height={64} alt="TW" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3>Tailwind</h3>
              </div>
            </div>
          </div>
          <div className="p-6 flex justify-center shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105 ease-in duration-300">
            <div className="grid grid-cols-2 gap-4 w-full justify-center items-center">
              <div className="m-auto flex">
                <Image src={supabase} width={64} height={64} alt="Node" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3>Supabase</h3>
              </div>
            </div>
          </div>
          <div className="p-6 flex justify-center shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105 ease-in duration-300">
            <div className="grid grid-cols-2 gap-4 w-full justify-center items-center">
              <div className="m-auto flex">
                <Image src={materialUI} width={64} height={64} alt="MUI" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3>Material UI</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
