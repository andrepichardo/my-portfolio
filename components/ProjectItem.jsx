import Image from 'next/image';
import Link from 'next/link';

const ProjectItem = ({ title, bgImage, projectUrl, technologies }) => {
  return (
    <div className="relative flex items-center justify-center w-full h-full shadow-xl xl:min-h-[390px] lg:min-h-[350px] lg:max-h-[400px] md:min-h-[285px] md:max-h-[285px] sm:min-h-[300px]  xs:min-h-[250px] xs:max-h-[250px] min-h-[220px] max-h-[220px] shadow-gray-400 dark:shadow-gray-900/80 rounded-xl group hover:bg-gradient-to-r from-[#5651e5] to-[#709dff]">
      <Image
        className="rounded-xl object-cover group-hover:opacity-10 transition-all duration-300 h-full w-full"
        src={bgImage}
        alt="Project Image"
      />
      <div className="absolute hidden group-hover:block top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <h3 className="text-2xl text-white tracking-wider text-center">
          {title}
        </h3>
        <p className="pb-4 pt-2 text-white text-center">{technologies}</p>
        <Link href={projectUrl}>
          <p className="text-center p-3 rounded-lg bg-white text-gray-700 hover:bg-[#eedeee] transition-all font-bold text-lg cursor-pointer">
            More Info
          </p>
        </Link>
      </div>
    </div>
  );
};

export default ProjectItem;
