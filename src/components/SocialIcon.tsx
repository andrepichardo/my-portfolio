import { AiOutlineMail } from 'react-icons/ai';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
} from 'react-icons/fa6';
import { FiGlobe } from 'react-icons/fi';
import type { IconType } from 'react-icons';

/**
 * Maps the `icon` string stored on a SocialLink to a component. Anything
 * unknown falls back to a globe rather than rendering nothing, so a typo in the
 * CMS never leaves an empty circle on the page.
 */
const ICONS: Record<string, IconType> = {
  linkedin: FaLinkedinIn,
  github: FaGithub,
  mail: AiOutlineMail,
  resume: BsFillPersonLinesFill,
  twitter: FaXTwitter,
  instagram: FaInstagram,
  whatsapp: FaWhatsapp,
  website: FiGlobe,
};

const SocialIcon = ({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) => {
  const Icon = ICONS[icon] ?? FiGlobe;
  return <Icon className={className} />;
};

export default SocialIcon;
