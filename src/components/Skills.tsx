import Image from 'next/image';
import { getSection, getSkills } from '@/lib/content';

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
        <p className="uppercase text-xl tracking-widest text-[#5651e5]">
          {section.eyebrow}
        </p>
        <h2 className="py-4">{section.heading}</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex justify-center p-6 duration-300 ease-in shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105"
            >
              <div className="grid items-center justify-center w-full grid-cols-2 gap-4">
                <div className="flex m-auto">
                  {/* unoptimized: logos can be uploaded through the CMS and land
                      on /api/images, or point at an arbitrary URL. */}
                  <Image
                    src={skill.imageUrl}
                    width={skill.iconSize}
                    height={skill.iconSize}
                    alt={skill.name}
                    unoptimized
                  />
                </div>
                <div className="flex flex-col items-center justify-center">
                  <h3>{skill.name}</h3>
                </div>
              </div>
            </div>
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
