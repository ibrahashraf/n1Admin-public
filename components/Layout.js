import Nav from "@/components/Nav";
import { useSession, signIn } from "next-auth/react";
import MenuIcon from '@mui/icons-material/Menu';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useState } from "react";
import Link from "next/link";
import Logo from '../assets/logo.png';
import Image from "next/image";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="bg-gray-700 w-screen h-screen flex items-center justify-center">
        <div className="text-center w-full">
          <button 
            onClick={() => signIn("google", session)} 
            className="bg-black hover:bg-black text-white font-semibold p-3 px-6 rounded-lg transition"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-sm:bg-gray-700 max-sm:min-h-screen">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 sm:hidden text-white sticky top-0 bg-gray-700 shadow-md">
        {!showNav ? (
          <button onClick={() => setShowNav(true)} className="p-2">
            <MenuIcon />
          </button>
        ) : (
          <button onClick={() => setShowNav(false)} className="p-2">
            <HighlightOffIcon />
          </button>
        )}

        <Link href={'/'} className="flex gap-2 items-center">
          <Image src={Logo} alt="logo" className="w-8 h-8" />
          <span className="text-white text-xl font-bold">Venus Admin</span>
        </Link>
      </div>

      {/* Main Layout */}
      <div className="sm:flex sm:bg-gray-700 sm:min-h-screen h-[calc(100vh-58px)]">
        <Nav show={showNav} />
        <div className="bg-white flex-grow m-2 rounded-md p-4 h-full sm:min-h-screen overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
