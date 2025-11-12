import Image from 'next/image';
import Logo from '../assets/logo.png';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import GradingIcon from '@mui/icons-material/Grading';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AppsIcon from '@mui/icons-material/Apps';
import LogoutIcon from '@mui/icons-material/Logout';
import RateReviewIcon from '@mui/icons-material/RateReview';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { Store } from '@mui/icons-material';

export default function Nav({ show }) {
  const inactiveLink = 'flex items-center gap-2 p-2 rounded-md text-white hover:bg-black transition';
  const activeLink = 'flex items-center gap-2 p-2 rounded-md bg-white text-gray-700 font-bold shadow-md';
  const router = useRouter();
  const { pathname } = router;

  return (
    <aside
      className={
        (show ? 'max-sm:left-0' : 'max-sm:-left-full') +
        ' text-white p-4 static h-full bg-gray-700 transition-all' +
        ' max-sm:fixed max-sm:w-full z-50'
      }
    >
      <Link href={'/'} className="flex gap-2 mb-6 items-center max-sm:hidden">
        <Image src={Logo} alt="logo" className="w-10 h-10" />
        <span className="text-white text-md font-bold">Venus Admin</span>
      </Link>

      <nav className="flex flex-col gap-3">
        <Link href={'/'} className={pathname === '/' ? activeLink : inactiveLink}>
          <HomeIcon />
          Dashboard
        </Link>

        <Link href={'/Products'} className={pathname.includes('/Products') ? activeLink : inactiveLink}>
          <AutoAwesomeMotionIcon />
          Products
        </Link>

        <Link href={'/Categories'} className={pathname.includes('/Categories') ? activeLink : inactiveLink}>
          <AppsIcon />
          Categories
        </Link>

        <Link href={'/Orders'} className={pathname === '/Orders' ? activeLink : inactiveLink}>
          <GradingIcon />
          Orders
        </Link>

        <Link href={'/Branches'} className={pathname === '/Branches' ? activeLink : inactiveLink}>
          <Store />
          Branches
        </Link>

        <Link href={'/Shipping'} className={pathname === '/Shipping' ? activeLink : inactiveLink}>
          <LocalShippingIcon />
          Shipping
        </Link>

        <Link href={'/Promotions'} className={pathname === '/Promotions' ? activeLink : inactiveLink}>
          <TrendingUpIcon />
          Promotions
        </Link>

        <Link href={'/Testimonials'} className={pathname === '/Testimonials' ? activeLink : inactiveLink}>
          <RateReviewIcon />
          Testimonials
        </Link>

        <Link href={'/Subscriptions'} className={pathname === '/Subscriptions' ? activeLink : inactiveLink}>
          <RecentActorsIcon />
          Subscriptions
        </Link>

        <button
          onClick={() => {
            signOut({ callbackUrl: '/', redirect: true });
          }}
          className={inactiveLink + " mt-4 text-black hover:text-white hover:bg-black"}
        >
          <LogoutIcon />
          Log out
        </button>
      </nav>
    </aside>
  );
}
