import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"
import SessionManager from "@/app/components/SessionManager"
import "./globals.css";
import Navbar from "./components/Navbar";


export const metadata: Metadata = {
  title: "Resume Tailor",
  description: "Tailor your resume to every job in seconds",
};



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en">
      <body className="overflow-hidden bg-cream">
        <SessionProvider session={session}>
          <SessionManager />
          <Navbar />
          <main>
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}