import HomepageBefore from "@/app/components/ui/HomepageBefore";
import HomepageAfter from "../components/ui/HomepageAfter";
import { getSession } from "@/app/actions/auth";
import { createClient } from "@/lib/supabaseServer";


const Page = async () => {
  const session = await getSession();
  const supabase = await createClient();
  const { data: { sessions }, error } = await supabase.auth.getSession();

  console.log("Session in Page Component:", sessions);
  console.log("Error fetching session:", error);
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