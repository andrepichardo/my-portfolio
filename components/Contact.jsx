import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineMail } from 'react-icons/ai';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import contact from '../public/assets/contact.jpg';
import { HiOutlineChevronDoubleUp } from 'react-icons/hi';

const Contact = () => {
  return (
    <div id="contact" className="w-full lg:h-screen">
      <div className="max-w-[1240px] m-auto px-5 xs:px-10 py-24 w-full">
        <p className="uppercase text-xl tracking-widest text-[#5651e5]">
          Contact
        </p>
        <h2 className="py-4">Get In Touch</h2>
        <div className="grid lg:grid-cols-5 gap-8">
          {/* left */}
          <div className="lg:col-span-2 flex  w-full h-full shadow-xl shadow-gray-400 rounded-xl px-5 py-10">
            <div className="lg:p-4 h-full flex flex-col justify-between">
              <div className=" flex rounded-xl ease-in duration-300 hover:scale-95">
                <Image className="rounded-xl " src={contact} alt="/" />
              </div>
              <div className="flex flex-col justify-center pb-4">
                <h2 className="py-2">André Pichardo</h2>
                <p className="text-justify font-light text-[17px] text-black">
                  Front-End Developer
                </p>
                <p className="py-4 text-lg text-justify font-light text-[17px] text-black">
                  I am available for freelance & full-time positions. Feel free
                  to contact me and let&apos;s talk.
                </p>
              </div>
              <div className="flex flex-col">
                <p className="uppercase pt-8 pb-3">Connect With Me</p>
                <div className="flex items-center justify-between max-w-[330px] gap-1 xs:gap-0 m-auto py-4 w-full">
                  <a
                    href="https://www.linkedin.com/in/andre-pichardo/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="rounded-full shadow-lg shadow-gray-400 p-3 xs:p-6 cursor-pointer hover:scale-110 ease-in duration-300">
                      <FaLinkedinIn className="w-5 h-5 text-blue-800" />
                    </div>
                  </a>
                  <a
                    href="https://github.com/andrepichardo"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="rounded-full shadow-lg shadow-gray-400 p-3 xs:p-6 cursor-pointer hover:scale-110 ease-in duration-300">
                      <FaGithub className="w-5 h-5 text-blue-800" />
                    </div>
                  </a>
                  <div className="rounded-full shadow-lg shadow-gray-400 p-3 xs:p-6 cursor-pointer hover:scale-110 ease-in duration-300">
                    <AiOutlineMail className="w-5 h-5 text-blue-800" />
                  </div>
                  <div className="rounded-full shadow-lg shadow-gray-400 p-3 xs:p-6 cursor-pointer hover:scale-110 ease-in duration-300">
                    <BsFillPersonLinesFill className="w-5 h-5 text-blue-800" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* right */}
          <div className="lg:col-span-3 w-full h-auto shadow-xl shadow-gray-400 rounded-xl px-3 lg:p-4">
            <div className="w-full py-4 ">
              <form className="">
                <div className="grid md:grid-cols-2 gap-4 px-2">
                  <div className="flex flex-col">
                    <label className="uppercase text-sm py-2">Full Name</label>
                    <input
                      className="border-2 w-full rounded-lg flex px-2 py-3 border-gray-300 outline-none"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="uppercase text-sm py-2">
                      Phone Number
                    </label>
                    <input
                      className="border-2 w-full rounded-lg flex  px-2  py-3 border-gray-300 outline-none"
                      type="text"
                    />
                  </div>
                </div>
                <div className="flex flex-col p-2">
                  <label className="uppercase text-sm py-2">Email</label>
                  <input
                    className="border-2 rounded-lg w-full flex  px-2 py-3 border-gray-300 outline-none"
                    type="email"
                  />
                </div>
                <div className="flex flex-col p-2">
                  <label className="uppercase text-sm py-2">Subject</label>
                  <input
                    className="border-2 rounded-lg w-full flex px-2  py-3 border-gray-300 outline-none"
                    type="text"
                  />
                </div>
                <div className="flex flex-col p-2">
                  <label className="uppercase text-sm py-2">Message</label>
                  <textarea className="border-2 resize-none w-full px-2 py-3 rounded-lg border-gray-300 outline-none min-h-[175px] max-h-[175px] sm:min-h-[225px] sm:max-h-[225px]" />
                </div>
                <div className="flex p-2">
                  <button className="w-full p-4 text-gray-100 mt-4">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-12">
          <Link href="/">
            <div className="rounded-full shadow-lg shadow-gray-400 p-4 cursor-pointer hover:scale-110 ease-in duration-300">
              <HiOutlineChevronDoubleUp
                className="m-auto text-[#5651e5]"
                size={30}
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
