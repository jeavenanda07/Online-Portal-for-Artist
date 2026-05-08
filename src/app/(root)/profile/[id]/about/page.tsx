import AboutList from "@/app/components/profile/about/AboutList";
import AboutContent from "@/app/components/profile/about/AboutContent";

const AboutPage = () => {
  return (
    <div className="w-full px-3 sm:px-5 lg:px-8 py-6 sm:py-8 lg:py-10">
      <div className="flex flex-col xl:flex-row gap-6 lg:gap-10 items-start max-w-[1600px] mx-auto">
        
        {/* SIDEBAR */}
        <aside className="w-full xl:w-[320px] shrink-0">
          <AboutList />
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 w-full">
          <AboutContent />
        </main>
      </div>
    </div>
  );
};

export default AboutPage;