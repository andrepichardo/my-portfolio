import Image from 'next/image';
import html from '../public/assets/skills/html.png';
import css from '../public/assets/skills/css.png';
import javascript from '../public/assets/skills/javascript.png';
import react from '../public/assets/skills/react.png';
import next from '../public/assets/skills/nextjs.png';
import tailwind from '../public/assets/skills/tailwind.png';
import materialUI from '../public/assets/skills/material-ui.svg';
import supabase from '../public/assets/skills/supabase.svg';
import mongodb from '../public/assets/skills/MongoDB.svg';
import postgresql from '../public/assets/skills/PostgreSQL.svg';
import node from '../public/assets/skills/node.png';
import prisma from '../public/assets/skills/Prisma.svg';

const Skills = () => {
  return (
    <div
      id="skills"
      className="w-full h-full md:min-h-screen flex items-center border-b-2 dark:border-[#2a374a] py-24"
    >
      <div className="max-w-[1240px] px-5 xs:px-10 xl:px-0 mx-auto flex flex-col justify-center w-full h-full">
        <p className="uppercase text-xl tracking-widest text-[#5651e5]">
          Skills
        </p>
        <h2 className="py-4">What I Can Do</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex justify-center p-6 duration-300 ease-in shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105">
            <div className="grid items-center justify-center w-full grid-cols-2 gap-4">
              <div className="flex m-auto">
                <Image src={html} width={64} height={64} alt="HTML" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3>HTML</h3>
              </div>
            </div>
          </div>
          <div className="flex justify-center p-6 duration-300 ease-in shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105">
            <div className="grid items-center justify-center w-full grid-cols-2 gap-4">
              <div className="flex m-auto">
                <Image src={css} width={64} height={64} alt="CSS" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3>CSS</h3>
              </div>
            </div>
          </div>
          <div className="flex justify-center p-6 duration-300 ease-in shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105">
            <div className="grid items-center justify-center w-full grid-cols-2 gap-4">
              <div className="flex m-auto">
                <Image src={javascript} width={64} height={64} alt="JS" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3>Javascript</h3>
              </div>
            </div>
          </div>
          <div className="flex justify-center p-6 duration-300 ease-in shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105">
            <div className="grid items-center justify-center w-full grid-cols-2 gap-4">
              <div className="flex m-auto">
                <Image src={react} width={64} height={64} alt="React" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3>React</h3>
              </div>
            </div>
          </div>
          <div className="flex justify-center p-6 duration-300 ease-in shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105">
            <div className="grid items-center justify-center w-full grid-cols-2 gap-4">
              <div className="flex m-auto">
                <Image src={next} width={64} height={64} alt="Next" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3>Next.js</h3>
              </div>
            </div>
          </div>
          <div className="flex justify-center p-6 duration-300 ease-in shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105">
            <div className="grid items-center justify-center w-full grid-cols-2 gap-4">
              <div className="flex m-auto">
                <Image src={tailwind} width={64} height={64} alt="TW" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3>Tailwind</h3>
              </div>
            </div>
          </div>
          <div className="flex justify-center p-6 duration-300 ease-in shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105">
            <div className="grid items-center justify-center w-full grid-cols-2 gap-4">
              <div className="flex m-auto">
                <Image src={materialUI} width={64} height={64} alt="MUI" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3>Material UI</h3>
              </div>
            </div>
          </div>
          <div className="flex justify-center p-6 duration-300 ease-in shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105">
            <div className="grid items-center justify-center w-full grid-cols-2 gap-4">
              <div className="flex m-auto">
                <Image src={node} width={64} height={64} alt="Node" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3>Node.js</h3>
              </div>
            </div>
          </div>
          <div className="flex justify-center p-6 duration-300 ease-in shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105">
            <div className="grid items-center justify-center w-full grid-cols-2 gap-4">
              <div className="flex m-auto">
                <Image src={supabase} width={64} height={64} alt="Node" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3>Supabase</h3>
              </div>
            </div>
          </div>
          <div className="flex justify-center p-6 duration-300 ease-in shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105">
            <div className="grid items-center justify-center w-full grid-cols-2 gap-4">
              <div className="flex m-auto">
                <Image src={postgresql} width={64} height={64} alt="Node" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3>PostgreSQL</h3>
              </div>
            </div>
          </div>
          <div className="flex justify-center p-6 duration-300 ease-in shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105">
            <div className="grid items-center justify-center w-full grid-cols-2 gap-4">
              <div className="flex m-auto">
                <Image src={mongodb} width={32} height={32} alt="Node" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3>MongoDB</h3>
              </div>
            </div>
          </div>
          <div className="flex justify-center p-6 duration-300 ease-in shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105">
            <div className="grid items-center justify-center w-full grid-cols-2 gap-4">
              <div className="flex m-auto">
                <Image src={prisma} width={40} height={40} alt="Node" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3>Prisma</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
