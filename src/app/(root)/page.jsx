import HomepageBefore from "@/app/components/ui/HomepageBefore";
import HomepageAfter from "../components/ui/HomepageAfter";
import {supabase} from "@/lib/supabaseClient";



const Page = async () => {
  return (
    <main className="mt-10">
      {session ? (
        <HomepageAfter />
      ) : (
        <HomepageBefore />
      )}
    </main>
  );
};

export default Page;