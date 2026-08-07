import Link from 'next/link';
import { getSection, getSocialLinks } from '@/lib/content';
import SocialIcon from './SocialIcon';

/** Paints the configured substring of the heading in the brand colour. */
function renderHeading(heading: string, highlight: string) {
  if (!highlight) return heading;
  const at = heading.indexOf(highlight);
  if (at === -1) return heading;

  return (
    <>
      {heading.slice(0, at)}
      <span className="text-[#5651e5]">{highlight}</span>
      {heading.slice(at + highlight.length)}
    </>
  );
}

const Main = async () => {
  const [hero, links] = await Promise.all([
    getSection('hero'),
    getSocialLinks(),
  ]);

  return (
    <div
      id="home"
      className="w-full border-b-2 dark:border-[#2a374a] h-screen text-center"
    >
      <div className="max-w-310 w-full mx-auto h-full flex justify-center items-center">
        <div className="flex flex-col gap-1">
          {hero.eyebrow && (
            <p className="uppercase text-sm tracking-widest text-gray-600 dark:text-[#ecf0f3] transition-all mb-2">
              {hero.eyebrow}
            </p>
          )}
          <h1 className="py-0 text-gray-700 dark:text-[#ecf0f3] transition-all">
            {renderHeading(hero.heading, hero.highlight)}
          </h1>
          {hero.subheading && (
            <h1 className="text-gray-700 dark:text-[#ecf0f3] transition-all mb-3 px-3">
              {hero.subheading}
            </h1>
          )}
          {hero.body[0] && (
            <p className="text-gray-600 dark:text-[#ecf0f3] transition-all max-w-[90%] md:max-w-[60%] m-auto font-light">
              {hero.body[0]}
            </p>
          )}
          <div className="flex items-center justify-around w-full gap-1 xs:gap-4 max-w-82.5 m-auto mt-3">
            {links.map((link) => {
              const internal = link.url.startsWith('/');
              const circle = (
                <div className="p-5 duration-300 ease-in rounded-full shadow-lg cursor-pointer shadow-gray-400 dark:shadow-gray-900 xs:p-6 hover:scale-110">
                  <SocialIcon
                    icon={link.icon}
                    className="w-5 h-5 text-blue-800"
                  />
                </div>
              );

              return internal ? (
                <Link
                  key={link.id}
                  className="rounded-full"
                  href={link.url}
                  aria-label={link.label}
                >
                  {circle}
                </Link>
              ) : (
                <a
                  key={link.id}
                  className="rounded-full"
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                >
                  {circle}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
