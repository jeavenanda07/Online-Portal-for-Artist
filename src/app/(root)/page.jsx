import HomepageBefore from "@/app/components/ui/HomepageBefore";
import HomepageAfter from "../components/ui/HomepageAfter";
import { getSession } from "@/app/actions/auth";

const Page = async () => {
  const session = await getSession();
  return (
    <main className="">
      {session ? (
        <HomepageAfter />
      ) : (
        <HomepageBefore />
      )}
    </main>
  );
};

export default Page;