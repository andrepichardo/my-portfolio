import Head from 'next/head';
import { FaDownload, FaGithub, FaLinkedinIn } from 'react-icons/fa';

const Resume = () => {
  return (
    <>
      <Head>
        <title>André Pichardo | Resume</title>
        <meta
          name="description"
          content="Dominican front-end web developer, specializing in building great digital experiences."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-[940px] mx-auto px-5 xs:px-10 xl:px-0 pt-[120px]">
        <h2 className="text-center">Resume</h2>
        <div className="bg-[#d0d4d6] dark:bg-[#2a374a] transition-all my-4 p-4 w-full flex justify-between flex-wrap gap-2 items-center">
          <h2 className="text-xl xs:text-3xl md:text-4xl">André Pichardo</h2>
          <div className="flex items-center gap-2">
            <a
              href="Resume-André-Pichardo.pdf"
              download
              className="p-0.5 xs:p-1"
            >
              <FaDownload className="w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-5 md:h-5 " />
            </a>
            <a
              href="https://www.linkedin.com/in/andre-pichardo/"
              target="_blank"
              rel="noreferrer"
              className="p-0.5 xs:p-1"
            >
              <FaLinkedinIn className="w-4 h-4 xs:w-5 xs:h-5 md:w-6 md:h-6 " />
            </a>
            <a
              href="https://github.com/andrepichardo"
              target="_blank"
              rel="noreferrer"
              className="p-0.5 xs:p-1"
            >
              <FaGithub className="w-4 h-4 xs:w-5 xs:h-5 md:w-6 md:h-6 " />
            </a>
          </div>
        </div>
        <div className="py-4 text-xl font-bold tracking-wider text-center uppercase">
          <div className="hidden sm:block">
            <p>
              Teamwork <span className="px-1">|</span> Web Development{' '}
              <span className="px-1">|</span>Problem Solving
            </p>
          </div>
          <div className="block sm:hidden">
            <p>Teamwork</p>
            <p className="py-2">Web Development</p>
            <p>Problem Solving</p>
          </div>
        </div>
        <p className="text-justify">
          Electronics and Communications Engineer based in Dominican Republic,
          currently specialized in Frontend Web Development field, constantly
          learning new technologies to grow in this great industry. Passionate,
          innovative, and motivated professional with experience in team
          collaboration, problem solving, and organizational effectiveness in
          fast-paced and challenging environments.
        </p>

        {/* Skills */}
        <div className="py-4 text-center">
          <h5 className="text-center underline text-[18px] py-2">Skills</h5>
          <p className="py-2">
            <span className="font-bold">Technical Skills</span>
            <span className="px-2">|</span> Web Development
            <span className="px-2">|</span> HTML
            <span className="px-2">|</span> CSS
            <span className="px-2">|</span> Javascript
            <span className="px-2">|</span> React
            <span className="px-2">|</span> NextJS
            <span className="px-2">|</span> PostgreSQL
            <span className="px-2">|</span> Redux
            <span className="px-2">|</span> TailwindCSS
            <span className="px-2">|</span> MongoDB
            <span className="px-2">|</span> Supabase
            <span className="px-2">|</span> RESTAPI
          </p>
          <p className="py-2">
            <span className="font-bold">Soft Skills</span>
            <span className="px-2">|</span> Communication
            <span className="px-2">|</span> Teamwork
            <span className="px-2">|</span> Organization
            <span className="px-2">|</span> Problem Solving
            <span className="px-2">|</span> Flexibility
          </p>
        </div>

        <h5 className="text-center underline text-[18px] py-4">
          Professional Experience
        </h5>
        {/* Experience */}
        <div className="py-6">
          <p className="italic">
            <span className="italic font-bold">
              Oficina Gubernamental De Tecnologías De La Información Y
              Comunicación (OGTIC)
            </span>
            <span className="px-2">|</span>Distrito Nacional, DO
          </p>
          <p className="py-1 italic">
            Front End Web Developer (Aug 2021 - Current)
          </p>
          <ul className="py-1 leading-relaxed text-justify list-disc list-outside px-7">
            <li className="p-2 cursor-pointer hover:shadow-md hover:rounded-lg">
              Development using mostly React.js, TypeScript & TailwindCSS.
            </li>
            <li className="p-2 cursor-pointer hover:shadow-md hover:rounded-lg">
              Create mobile responsive web applications with special attention
              and implementation of SEO, UI/UX and clean code.
            </li>
            <li className="p-2 cursor-pointer hover:shadow-md hover:rounded-lg">
              Troubleshoot issues and concerns found in QA Testing process, such
              as functionality and design changes as needed.
            </li>
            <li className="p-2 cursor-pointer hover:shadow-md hover:rounded-lg">
              Work along with other developers to create and implement multiple
              technologies and programs.
            </li>
          </ul>
        </div>

        {/* Experience */}
        <div className="py-6">
          <p className="italic">
            <span className="italic font-bold">Altice Dominicana</span>
            <span className="px-2">|</span>Distrito Nacional, DO
          </p>
          <p className="py-1 italic">
            Software QA Tester (Jul 2019 - Aug 2021)
          </p>
          <ul className="py-1 leading-relaxed text-justify list-disc list-outside px-7">
            <li className="p-2 cursor-pointer hover:shadow-md hover:rounded-lg">
              Carrying out different QA tests to guarantee the correct operation
              of the new FW and SW that were deployed throughout the Headend
              network (TV clients).
            </li>
            <li className="p-2 cursor-pointer hover:shadow-md hover:rounded-lg">
              Identification of errors / bugs to later be reported and corrected
              with the developer team.
            </li>
            <li className="p-2 cursor-pointer hover:shadow-md hover:rounded-lg">
              Constant communication with foreign developers from Europe (in
              English).
            </li>
            <li className="p-2 cursor-pointer hover:shadow-md hover:rounded-lg">
              Weekly reports with the results of the tests carried out on the
              latest version of FW / SW released.
            </li>
          </ul>
        </div>

        {/*  */}
        <h5 className="text-center underline text-[18px] py-4">
          Other Professional Experience
        </h5>

        {/* Experience */}
        <div className="py-6">
          <p className="italic">
            <span className="font-bold">Altice Dominicana</span>
            <span className="px-2">|</span>Distrito Nacional, DO
          </p>
          <p className="py-1 italic">
            Warehouse Assistant (May 2019 - Jul 2019)
          </p>
          <ul className="py-1 leading-relaxed text-justify list-disc list-outside px-7">
            <li className="p-2 cursor-pointer hover:shadow-md hover:rounded-lg">
              Assist with receiving, unloading, counting and stocking physical
              inventory in the warehouse.
            </li>
            <li className="p-2 cursor-pointer hover:shadow-md hover:rounded-lg">
              Ensure orders are processed efficiently and that the delivery of
              materials meets business timelines.
            </li>
            <li className="p-2 cursor-pointer hover:shadow-md hover:rounded-lg">
              Pack item according to specified packing guidelines.
            </li>
            <li className="p-2 cursor-pointer hover:shadow-md hover:rounded-lg">
              Inspect items to ensure they&apos;re not damaged or faulty and
              adjust inventory accordingly.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Resume;
