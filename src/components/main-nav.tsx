'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { Home, PenSquare, Gem, UserCircle, Menu, Headphones, Music, Moon, History } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Logo } from './logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useState } from 'react';

const navItems = [
  { href: '/home', label: 'Home', icon: Home, pro: false },
  { href: '/journal', label: 'Journal', icon: PenSquare, pro: false },
  { href: '/meditations', label: 'Meditate', icon: Headphones, pro: false },
  { href: '/soundscapes', label: 'Sounds', icon: Music, pro: false },
  { href: '/dream-journal', label: 'Dreams', icon: Moon, pro: true },
  { href: '/journal-history', label: 'History', icon: History, pro: true },
];

const accountNavItems = [
    { href: '/pricing', label: 'Upgrade', icon: Gem },
    { href: '/profile', label: 'Profile', icon: UserCircle },
]

const NavLink = ({ href, label, icon: Icon, pathname, isMobile, closeSheet }: { href: string; label: string; icon: React.ElementType; pathname: string; isMobile: boolean; closeSheet?: () => void }) => {
  const isActive = pathname === href;
  const Comp = isMobile ? 'div' : 'div';
  return (
    <Link href={href} passHref legacyBehavior>
      <a onClick={closeSheet}>
        <Comp
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            isActive && 'bg-primary/10 text-primary',
            isMobile && 'flex-col justify-center h-16 text-xs gap-1',
            !isMobile && 'justify-start'
          )}
        >
          <Icon className="h-5 w-5" />
          {isMobile ? label : <span className='font-medium'>{label}</span>}
        </Comp>
      </a>
    </Link>
  );
};

function DesktopNav({ pathname }: { pathname: string }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const avatarUrl = PlaceHolderImages.find(p => p.id === 'user-avatar')?.imageUrl;

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
    });
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-background md:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link href="/home" className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
          <Logo />
          <span className="sr-only">Cielo</span>
        </Link>
        {navItems.filter(item => !item.pro || user?.isUpgraded).map((item) => (
          <Link key={item.href} href={item.href} className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8", pathname.startsWith(item.href) && "bg-accent text-accent-foreground")}>
             <item.icon className="h-5 w-5" />
             <span className="sr-only">{item.label}</span>
          </Link>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} alt={user?.username} data-ai-hint="person portrait"/>
                <AvatarFallback>{user?.username?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/pricing">Billing</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </aside>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
    const [open, setOpen] = useState(false);
    const { user } = useAuth();
  
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link href="/home" className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
                            <Logo />
                            <span className="sr-only">Cielo</span>
                        </Link>
                        {navItems.filter(item => !item.pro || user?.isUpgraded).map((item) => (
                            <NavLink key={item.href} {...item} pathname={pathname} isMobile={false} closeSheet={() => setOpen(false)} />
                        ))}
                        <DropdownMenuSeparator />
                        {accountNavItems.map((item) => (
                            <NavLink key={item.href} {...item} pathname={pathname} isMobile={false} closeSheet={() => setOpen(false)} />
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
            <Link href="/home">
                <span className="font-headline text-xl font-bold">Cielo</span>
            </Link>
        </header>
    );
}

export default function MainNav() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  
  if (isMobile === undefined) {
    return null; // or a loading skeleton
  }

  return isMobile ? <MobileNav pathname={pathname} /> : <DesktopNav pathname={pathname} />;
}
