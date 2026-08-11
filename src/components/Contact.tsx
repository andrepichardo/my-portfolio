import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineChevronDoubleUp } from 'react-icons/hi';
import { getSection, getSocialLinks } from '@/lib/content';
import ContactForm from './ContactForm';
import SocialIcon from './SocialIcon';
import Reveal from './Reveal';

const Contact = async () => {
  const [contact, links] = await Promise.all([
    getSection('contact'),
    getSocialLinks(),
  ]);

  const [role, ...paragraphs] = contact.body;

  return (
    <div
      id="contact"
      className="flex flex-col items-center justify-center w-full h-full md:min-h-screen"
    >
      <div className="max-w-310 m-auto px-5 xs:px-10 xl:px-0 pt-24 pb-10 w-full">
        <Reveal>
          <p className="uppercase text-xl tracking-widest text-[#5651e5]">
            {contact.eyebrow}
          </p>
          <h2 className="py-4">{contact.heading}</h2>
        </Reveal>
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-5">
          {/* left */}
          <Reveal className="flex w-full h-full px-5 py-10 shadow-xl lg:col-span-2 shadow-gray-400 dark:shadow-gray-900/80 rounded-xl">
            <div className="flex flex-col justify-between h-full lg:p-4">
              {contact.imageUrl && (
                <div className="flex duration-300 ease-in rounded-xl hover:scale-95">
                  {/* unoptimized: the src can be a CMS upload or any URL. */}
                  <Image
                    className="rounded-xl"
                    src={contact.imageUrl}
                    alt={contact.subheading || 'Contact'}
                    width={600}
                    height={400}
                    unoptimized
                  />
                </div>
              )}
              <div className="flex flex-col justify-center pb-4">
                {contact.subheading && (
                  <h2 className="py-2">{contact.subheading}</h2>
                )}
                {role && (
                  <p className="text-justify font-light text-[17px] text-black dark:text-[#ecf0f3] transition-all">
                    {role}
                  </p>
                )}
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="py-4 text-lg text-justify font-light text-[17px] text-black dark:text-[#ecf0f3] transition-all"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="flex flex-col">
                <p className="uppercase pt-8 pb-3 text-lg font-light text-black dark:text-[#ecf0f3] transition-all">
                  Connect With Me
                </p>
                <div className="flex items-center justify-between max-w-100 flex-wrap gap-1 gap-y-4 xs:gap-0 m-auto py-4 w-full">
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
          </Reveal>
          {/* right */}
          <Reveal
            delay={150}
            className="w-full h-auto px-3 shadow-xl lg:col-span-3 shadow-gray-400 dark:shadow-gray-900/80 rounded-xl lg:p-4"
          >
            <div className="w-full py-4">
              <ContactForm />
            </div>
          </Reveal>
        </div>
        <div className="flex justify-center pt-16">
          <Link
            className="p-4 duration-300 ease-in rounded-full shadow-lg cursor-pointer shadow-gray-400 dark:shadow-gray-900/80 animate-bounce hover:scale-110"
            href="/"
            aria-label="Back to top"
          >
            <HiOutlineChevronDoubleUp
              className="text-[#5651e5]"
              size={30}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
