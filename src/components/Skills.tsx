import Image from 'next/image';

const skills = [
  { name: 'HTML', src: '/assets/skills/html.png', size: 64 },
  { name: 'CSS', src: '/assets/skills/css.png', size: 64 },
  { name: 'Javascript', src: '/assets/skills/javascript.png', size: 64 },
  { name: 'React', src: '/assets/skills/react.png', size: 64 },
  { name: 'Next.js', src: '/assets/skills/nextjs.png', size: 64 },
  { name: 'Tailwind', src: '/assets/skills/tailwind.png', size: 64 },
  { name: 'Material UI', src: '/assets/skills/material-ui.svg', size: 64 },
  { name: 'Node.js', src: '/assets/skills/node.png', size: 64 },
  { name: 'Supabase', src: '/assets/skills/supabase.svg', size: 64 },
  { name: 'PostgreSQL', src: '/assets/skills/PostgreSQL.svg', size: 64 },
  { name: 'MongoDB', src: '/assets/skills/MongoDB.svg', size: 32 },
  { name: 'Prisma', src: '/assets/skills/Prisma.svg', size: 40 },
];

const Skills = () => {
  return (
    <div
      id="skills"
      className="w-full h-full md:min-h-screen flex items-center border-b-2 dark:border-[#2a374a] py-24"
    >
      <div className="max-w-310 px-5 xs:px-10 xl:px-0 mx-auto flex flex-col justify-center w-full h-full">
        <p className="uppercase text-xl tracking-widest text-[#5651e5]">
          Skills
        </p>
        <h2 className="py-4">What I Can Do</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="flex justify-center p-6 duration-300 ease-in shadow-lg dark:shadow-gray-900/80 rounded-xl hover:scale-105"
            >
              <div className="grid items-center justify-center w-full grid-cols-2 gap-4">
                <div className="flex m-auto">
                  <Image
                    src={skill.src}
                    width={skill.size}
                    height={skill.size}
                    alt={skill.name}
                  />
                </div>
                <div className="flex flex-col items-center justify-center">
                  <h3>{skill.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
