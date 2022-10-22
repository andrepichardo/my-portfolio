import Image from 'next/image';
import Link from 'next/link';
import andrePP from '../public/assets/LosCacaosPP.jpg';

const About = () => {
  return (
    <div
      id="about"
      className="w-full md:h-screen border-b-2 p-2 flex items-center py-24"
    >
      <div className="max-w-[1240px] px-10 xl:px-0 m-auto md:grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <p className="uppercase text-xl tracking-widest text-[#5651e5]">
            About
          </p>
          <h2 className="py-4">Who I Am</h2>
          <p className="py-2 text-justify font-light text-[17px] text-black">
            I specialize in building responsive front-end web applications that
            connect with API&apos;s and other backend technologies. Though I am
            most proficient in building front-end applications using HTML, CSS,
            Javascript and React, I am a quick learner and can pick up new tech
            stacks as needed. I believe that being a great developer is not
            using one specific language, but choosing the best tool for the job.
          </p>
          <p className="py-2 text-justify font-light text-[17px] text-black">
            As an Electronics and Communications engineer, my career as a
            programmer started in 2019 when I was working as a QA Software
            Tester for a telecom company. There I started learning HTML, CSS and
            Javascript to fix some minor UI and programming issues in some of
            their projects, and in 2021 I officially got my first job as a
            frontend developer in the company I currently work for, while
            I&apos;m also working on personal projects too.
          </p>
          <Link href="/#projects">
            <p className="py-2 text-gray-600 underline text-sm md:text-base cursor-pointer">
              Check out some of my latest projects.
            </p>
          </Link>
        </div>
        <div className="w-full h-auto m-auto shadow-xl shadow-gray-400 rounded-xl flex items-center justify-center p-4 hover:scale-105 ease-in duration-300">
          <Image src={andrePP} alt="/" />
        </div>
      </div>
    </div>
  );
};

export default About;
