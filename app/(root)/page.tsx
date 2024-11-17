import Documents from "@/components/Documents";
import Header from "@/components/Header";
import Notifications from "@/components/Notifications";
import SkeletonDocument from "@/components/SkeletonDocument";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { redirect } from "next/navigation";

const Home = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>
      <Suspense fallback={<SkeletonDocument />}>
        <Documents clerkUser={clerkUser} />
      </Suspense>
    </main>
  );
};

export default Home;
