import Image from 'next/image';
import { getSection, getSkills } from '@/lib/content';
import Reveal from './Reveal';

const Skills = async () => {
  const [section, skills] = await Promise.all([
    getSection('skills'),
    getSkills(),
  ]);

  return (
    <div
      id="skills"
      className="w-full h-full md:min-h-screen flex items-center border-b-2 dark:border-[#2a374a] py-24"
    >
      <div className="max-w-310 px-5 xs:px-10 xl:px-0 mx-auto flex flex-col justify-center w-full h-full">
        <Reveal>
          <p className="uppercase text-xl tracking-widest text-[#5651e5]">
            {section.eyebrow}
          </p>
          <h2 className="py-4">{section.heading}</h2>
        </Reveal>
        {/* Two per row on phones. One column meant ~3.7 screens of scrolling
            for twenty cards, which reads as a chore rather than a list. */}
        <div className="reveal-stagger grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
          {skills.map((skill) => (
            <Reveal
              key={skill.id}
              // The stagger comes from `.reveal-stagger` in globals.css, which
              // delays each card by its position in its row — a per-item delay
              // here could not follow the column count across breakpoints.
              className="flex justify-center p-4 sm:p-6 duration-300 ease-in shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105"
            >
              {/* Logo above the name while the card is narrow; side by side
                  from sm up, where there is room for both. */}
              <div className="grid items-center justify-center w-full grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div className="flex m-auto">
                  {/* unoptimized: logos can be uploaded through the CMS and land
                      on /api/images, or point at an arbitrary URL. */}
                  <Image
                    src={skill.imageUrl}
                    width={skill.iconSize}
                    height={skill.iconSize}
                    alt={skill.name}
                    // Cap the logo on phones only. This has to be max-width /
                    // max-height, not width / height: a CSS `width` overrides
                    // the img's width attribute entirely, which drops every
                    // logo to its intrinsic size — the simple-icons SVGs have
                    // none and vanish, the rest blow up. A max-* only clamps,
                    // so above sm each logo keeps its own tuned size.
                    className="max-w-10 max-h-10 sm:max-w-none sm:max-h-none"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-sm sm:text-base text-center">
                    {skill.name}
                  </h3>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        {skills.length === 0 && (
          <p className="text-gray-500 py-8">No skills yet.</p>
        )}
      </div>
    </div>
  );
};

export default Skills;
