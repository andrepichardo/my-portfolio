import Image from 'next/image';
import Link from 'next/link';

interface ProjectItemProps {
  title: string;
  imageUrl: string;
  projectUrl: string;
  technologies: string;
}

const ProjectItem = ({
  title,
  imageUrl,
  projectUrl,
  technologies,
}: ProjectItemProps) => {
  return (
    <div className="relative flex items-center justify-center w-full h-full shadow-xl xl:min-h-97.5 lg:min-h-87.5 lg:max-h-100 md:min-h-71.25 md:max-h-71.25 sm:min-h-75 xs:min-h-62.5 xs:max-h-62.5 min-h-55 max-h-55 shadow-gray-400 dark:shadow-gray-900/80 rounded-xl group hover:bg-linear-to-r from-[#5651e5] to-[#709dff]">
      <Image
        className="rounded-xl object-cover group-hover:opacity-10 transition-all duration-500 h-full w-full"
        src={imageUrl}
        alt={title}
        width={600}
        height={400}
      />
      <div className="absolute hidden group-hover:block top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <h3 className="text-2xl text-white tracking-wider text-center">
          {title}
        </h3>
        <p className="pb-4 pt-2 text-white text-center">{technologies}</p>
        <Link
          href={projectUrl}
          className="block text-center p-3 rounded-lg bg-white text-gray-700 hover:bg-[#eedeee] transition-all font-bold text-lg cursor-pointer"
        >
          More Info
        </Link>
      </div>
    </div>
  );
};

export default ProjectItem;
