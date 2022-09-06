import Image from 'next/image';
import Link from 'next/link';

const ProjectItem = ({ title, bgImage, projectUrl }) => {
  return (
    <div className="relative flex items-center justify-center w-full shadow-xl shadow-gray-400 rounded-xl p-3 group hover:bg-gradient-to-r from-[#5651e5] to-[#709dff]">
      <Image
        width={600}
        height={400}
        className="rounded-xl group-hover:opacity-10"
        src={bgImage}
        alt="/"
      />
      <div className="absolute hidden group-hover:block top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <h3 className="text-2xl text-white tracking-wider text-center">
          {title}
        </h3>
        <p className="pb-4 pt-2 text-white text-center">React JS</p>
        <Link href={projectUrl}>
          <p className="text-center p-3 rounded-lg bg-white text-gray-700 font-bold text-lg cursor-pointer">
            More Info
          </p>
        </Link>
      </div>
    </div>
  );
};

export default ProjectItem;
