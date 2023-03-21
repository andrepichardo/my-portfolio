import ProjectItem from './ProjectItem';
import gifexpert from '../public/projects/gifexpertapp.png';
import linkspace from '../public/projects/linkspaceapp.png';
import becas from '../public/projects/becatufuturo.png';
import gobdo from '../public/projects/gobdo.png';

const Projects = () => {
  return (
    <div
      id="projects"
      className="w-full md:min-h-screen h-full flex items-center border-b-2 dark:border-[#2a374a]"
    >
      <div className="max-w-[1240px] px-5 xs:px-10 xl:px-0 mx-auto py-24">
        <p className="uppercase text-xl tracking-widest text-[#5651e5]">
          Projects
        </p>
        <h2 className="py-4">What I&apos;ve Built</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <ProjectItem
            title="LinkSpaceApp"
            bgImage={linkspace}
            projectUrl="/linkspace"
            technologies="NextJS | Tailwind | Supabase"
          />
          <ProjectItem
            title="Gob.do Portal"
            bgImage={gobdo}
            projectUrl="/gobdo"
            technologies="NextJS | Tailwind | React Query"
          />
          <ProjectItem
            title="GifExpertApp"
            bgImage={gifexpert}
            projectUrl="/gifexpert"
            technologies="ReactJS | Tailwind | GIPHY API"
          />
          <ProjectItem
            title="Beca tu Futuro"
            bgImage={becas}
            projectUrl="/becas"
            technologies="ReactJS | Tailwind | Redux"
          />
        </div>
      </div>
    </div>
  );
};

export default Projects;
