import ExploreLayout from "@/app/components/home/ExploreLayout";

export default function Home() {
  return (
  <div className="max-w-[2000px] w-full mx-auto flex flex-col  -mt-15"> 
    <main className="flex flex-col justify-between items-start gap-10">
      <div className=" w-full flex flex-col gap-12 ">
        {/* <div>
          <FeauturedArt />
        </div>
      
          <hr className="bg-line h-[1px] opacity-10 w-full"/>     */}

        {/* <TopSellers /> */}

        {/* <hr className="bg-line h-[1px] opacity-10 w-full mt-3"/>  */}
        <ExploreLayout/>
      </div>
    </main>
  </div>
  );
}
