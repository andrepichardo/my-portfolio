import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

const Page404 = () => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-[1240px] m-auto px-5 xs:px-10 xl:px-0 py-24 w-full flex flex-col justify-center items-center gap-6 md:gap-12 text-[#5651e5]">
        <h4 className="text-3xl sm:text-4xl md:text-6xl text-center">
          404 | Page not Found
        </h4>
        <Link
          className="flex items-center underline underline-offset-4 font-semibold hover:text-[#5651e5]/50 transition-all duration-300"
          href="/"
        >
          Back to Home <FiChevronRight />
        </Link>
      </div>
    </div>
  );
};

export default Page404;
