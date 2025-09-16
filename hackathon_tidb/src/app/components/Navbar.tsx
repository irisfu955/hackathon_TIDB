import { auth, signOut, signIn } from "@/auth";
import Link from "next/link";
import React from "react";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="px-5 py-3 bg-deepsea ">
      <nav className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          {session && session?.user ? (
            <>
             <Link href={`/user/${session?.sub}`}>
                <span>{session?.user?.name}</span>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button type="submit" className="text-navyblue bg-creamyblue px-4 py-2 rounded-md hover:bg-navyblue hover:text-creamyblue transition-all duration-300">Logout</button>
              </form>
             
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn();
              }}
            >
              <button type="submit" className="text-navyblue bg-creamyblue px-4 py-2 rounded-md hover:bg-navyblue hover:text-creamyblue transition-all duration-300">Login</button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
