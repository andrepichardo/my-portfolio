import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineMail } from 'react-icons/ai';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import { FaGithub, FaLinkedinIn, FaSpinner } from 'react-icons/fa';
import contact from '../public/assets/contact.jpg';
import { HiOutlineChevronDoubleUp } from 'react-icons/hi';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const Contact = () => {
  const success = () =>
    toast.success('Message sent successfully!', {
      id: 'success',
    });
  const error = () =>
    toast.error('Message could not be sent.', {
      id: 'error',
    });

  // States for contact form fields
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  //   Form validation state
  const [errors, setErrors] = useState({});

  //   Setting button text on form submission
  const [buttonText, setButtonText] = useState('Send Message');

  // Setting success or failure messages states
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFailureMessage, setShowFailureMessage] = useState(false);

  // Validation check method
  const handleValidation = () => {
    let tempErrors = {};
    let isValid = true;

    if (fullname.length <= 0) {
      tempErrors['fullname'] = true;
      isValid = false;
    }
    if (email.length <= 0) {
      tempErrors['email'] = true;
      isValid = false;
    }
    if (subject.length <= 0) {
      tempErrors['subject'] = true;
      isValid = false;
    }
    if (message.length <= 0) {
      tempErrors['message'] = true;
      isValid = false;
    }

    setErrors({ ...tempErrors });
    return isValid;
  };

  //   Handling form submit

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValidForm = handleValidation();

    if (isValidForm) {
      setButtonText(
        <div className="w-full flex justify-center items-center gap-1.5">
          Sending <FaSpinner className="animate-spin" />
        </div>
      );
      const res = await fetch('/api/sendgrid', {
        body: JSON.stringify({
          email: email,
          fullname: fullname,
          subject: subject,
          message: message,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      const { error } = await res.json();
      if (error) {
        setShowSuccessMessage(false);
        setShowFailureMessage(true);
        setButtonText('Send Message');
        // Reset form fields
        setFullname('');
        setEmail('');
        setMessage('');
        setSubject('');
        return;
      }
      setShowSuccessMessage(true);
      setShowFailureMessage(false);
      setButtonText('Send Message');
      // Reset form fields
      setFullname('');
      setEmail('');
      setMessage('');
      setSubject('');
      return;
    }
  };

  return (
    <div
      id="contact"
      className="flex flex-col items-center justify-center w-full h-full md:min-h-screen"
    >
      <div className="max-w-[1240px] m-auto px-5 xs:px-10 xl:px-0 pt-24 pb-10 w-full">
        <p className="uppercase text-xl tracking-widest text-[#5651e5]">
          Contact
        </p>
        <h2 className="py-4">Get In Touch</h2>
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-5">
          {/* left */}
          <div className="flex w-full h-full px-5 py-10 shadow-xl lg:col-span-2 shadow-gray-400 dark:shadow-gray-900/80 rounded-xl">
            <div className="flex flex-col justify-between h-full lg:p-4">
              <div className="flex duration-300 ease-in  rounded-xl hover:scale-95">
                <Image className="rounded-xl " src={contact} alt="/" />
              </div>
              <div className="flex flex-col justify-center pb-4">
                <h2 className="py-2">André Pichardo</h2>
                <p className="text-justify font-light text-[17px] text-black dark:text-[#ecf0f3] transition-all">
                  Front-End Developer
                </p>
                <p className="py-4 text-lg text-justify font-light text-[17px] text-black dark:text-[#ecf0f3] transition-all ">
                  I am available for freelance & full-time positions. Feel free
                  to contact me and let&apos;s talk.
                </p>
              </div>
              <div className="flex flex-col">
                <p className="uppercase pt-8 pb-3 text-lg font-light text-black dark:text-[#ecf0f3] transition-all">
                  Connect With Me
                </p>
                <div className="flex items-center justify-between max-w-[400px] flex-wrap gap-1 gap-y-4 xs:gap-0 m-auto py-4 w-full">
                  <a
                    className="rounded-full"
                    href="https://www.linkedin.com/in/andre-pichardo/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="p-5 duration-300 ease-in rounded-full shadow-lg cursor-pointer shadow-gray-400 dark:shadow-gray-900 xs:p-6 hover:scale-110">
                      <FaLinkedinIn className="w-5 h-5 text-blue-800" />
                    </div>
                  </a>
                  <a
                    className="rounded-full"
                    href="https://github.com/andrepichardo"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="p-5 duration-300 ease-in rounded-full shadow-lg cursor-pointer shadow-gray-400 dark:shadow-gray-900 xs:p-6 hover:scale-110">
                      <FaGithub className="w-5 h-5 text-blue-800" />
                    </div>
                  </a>
                  <Link className="rounded-full" href="/#contact">
                    <div className="p-5 duration-300 ease-in rounded-full shadow-lg cursor-pointer shadow-gray-400 dark:shadow-gray-900 xs:p-6 hover:scale-110">
                      <AiOutlineMail className="w-5 h-5 text-blue-800" />
                    </div>
                  </Link>
                  <Link className="rounded-full" href="/resume">
                    <div className="p-5 duration-300 ease-in rounded-full shadow-lg cursor-pointer shadow-gray-400 dark:shadow-gray-900 xs:p-6 hover:scale-110">
                      <BsFillPersonLinesFill className="w-5 h-5 text-blue-800" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* right */}
          <div className="w-full h-auto px-3 shadow-xl lg:col-span-3 shadow-gray-400 dark:shadow-gray-900/80 rounded-xl lg:p-4">
            <div className="w-full py-4">
              <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="flex flex-col p-2">
                  <label className="py-2 text-sm uppercase">Full Name</label>
                  <input
                    className="border-2 w-full rounded-lg flex px-2 py-3 border-gray-300 transition-all dark:border-[#3e4b60] dark:focus:border-[#5651e5]/50 focus:border-[#5651e5]/50 outline-none"
                    type="text"
                    value={fullname}
                    onChange={(e) => {
                      setFullname(e.target.value);
                    }}
                  />
                  {errors?.fullname && (
                    <p className="text-red-500">Full name cannot be empty.</p>
                  )}
                </div>
                <div className="flex flex-col p-2">
                  <label className="py-2 text-sm uppercase">Email</label>
                  <input
                    className="border-2 rounded-lg w-full flex  px-2 py-3 border-gray-300 transition-all dark:border-[#3e4b60] dark:focus:border-[#5651e5]/50 focus:border-[#5651e5]/50 outline-none"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  {errors?.email && (
                    <p className="text-red-500">Email cannot be empty.</p>
                  )}
                </div>
                <div className="flex flex-col p-2">
                  <label className="py-2 text-sm uppercase">Subject</label>
                  <input
                    className="border-2 rounded-lg w-full flex px-2  py-3 border-gray-300 transition-all dark:border-[#3e4b60] dark:focus:border-[#5651e5]/50 focus:border-[#5651e5]/50 outline-none"
                    type="text"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                    }}
                  />
                  {errors?.subject && (
                    <p className="text-red-500">Subject cannot be empty.</p>
                  )}
                </div>
                <div className="flex flex-col p-2">
                  <label className="py-2 text-sm uppercase">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                    className="border-2 resize-none w-full px-2 py-3 rounded-lg transition-all border-gray-300 dark:border-[#3e4b60] dark:focus:border-[#5651e5]/50 focus:border-[#5651e5]/50 outline-none min-h-[175px] max-h-[175px] sm:min-h-[225px] sm:max-h-[225px]"
                  />
                  {errors?.message && (
                    <p className="text-red-500">
                      Message body cannot be empty.
                    </p>
                  )}
                </div>
                <div className="flex p-2">
                  <button
                    type="submit"
                    className="w-full p-4 mt-4 transition-all buttonForm"
                  >
                    {buttonText}
                  </button>
                  <Toaster position="top-right" reverseOrder={false} />
                  {showFailureMessage
                    ? error() && setShowFailureMessage(false)
                    : ''}
                  {showSuccessMessage
                    ? success() && setShowSuccessMessage(false)
                    : ''}
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-16">
          <Link
            className="p-4 duration-300 ease-in rounded-full shadow-lg cursor-pointer shadow-gray-400 dark:shadow-gray-900/80 animate-bounce hover:scale-110"
            href="/"
          >
            <HiOutlineChevronDoubleUp
              className="m-auto text-[#5651e5]"
              size={30}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
