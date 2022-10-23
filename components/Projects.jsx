import ProjectItem from './ProjectItem';
import gifexpert from '../public/projects/gifexpertapp.png';

const Projects = () => {
  return (
    <div id="projects" className="w-full border-b-2">
      <div className="max-w-[1240px] px-5 xs:px-10 xl:px-0 mx-auto py-24">
        <p className="uppercase text-xl tracking-widest text-[#5651e5]">
          Projects
        </p>
        <h2 className="py-4">What I&apos;ve Built</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <ProjectItem
            title="GifExpertApp"
            bgImage={gifexpert}
            projectUrl="/gifexpert"
          />
        </div>
      </div>
    </div>
  );
};

export default Projects;
