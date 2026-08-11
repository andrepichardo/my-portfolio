import Image from 'next/image';
import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';
import { getSection } from '@/lib/content';
import Reveal from './Reveal';

const About = async () => {
  const about = await getSection('about');

  return (
    <div
      id="about"
      className="w-full md:min-h-screen h-full border-b-2 dark:border-[#2a374a] flex items-center py-24"
    >
      <div className="max-w-310 px-5 xs:px-10 xl:px-0 m-auto md:grid grid-cols-3 gap-8">
        <Reveal className="col-span-2">
          <p className="uppercase text-xl tracking-widest text-[#5651e5]">
            {about.eyebrow}
          </p>
          <h2 className="py-4">{about.heading}</h2>
          {about.body.map((paragraph, index) => (
            <p
              key={index}
              className="py-2 text-justify font-light text-[17px] text-black dark:text-[#ecf0f3] transition-all"
            >
              {paragraph}
            </p>
          ))}
          {about.ctaLabel && (
            <Link
              className="flex w-fit items-center text-gray-600 dark:text-[#abb8c2] hover:text-gray-400 dark:hover:text-[#78848d] transition-all duration-300"
              href={about.ctaHref || '/#projects'}
            >
              <p className="py-2 text-sm underline cursor-pointer underline-offset-2 md:text-base">
                {about.ctaLabel}
              </p>
              <FiChevronDown />
            </Link>
          )}
        </Reveal>
        {about.imageUrl && (
          <Reveal
            delay={150}
            className="flex items-center justify-center w-full h-auto p-4 m-auto duration-300 ease-in shadow-xl shadow-gray-400 dark:shadow-gray-900/80 rounded-xl hover:scale-105"
          >
            {/* unoptimized: the src may be an uploaded /api/images path or an
                arbitrary URL set from the CMS. */}
            <Image
              className="w-full rounded-md"
              src={about.imageUrl}
              alt={about.heading}
              width={400}
              height={500}
              unoptimized
            />
          </Reveal>
        )}
      </div>
    </div>
  );
};

export default About;
