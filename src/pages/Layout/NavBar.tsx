import {
  Button,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@ui';
import { TbMenu3, TbSettings, TbLogout } from 'react-icons/tb';
import { Link, useNavigate } from 'react-router';
import { ThemeToggle } from './ThemeToggle';
import { supabase } from '@sb';
import { toast } from '@ui';
import { LuBrainCircuit } from 'react-icons/lu';

function Menu() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login', { replace: true });
    } catch {
      toast.error('Failed to log out!');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" aria-label="menu-button">
          <TbMenu3 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="*:cursor-pointer **:text-[1rem]" align="end">
        <Link to="/settings">
          <DropdownMenuItem className="cursor-pointer">
            <TbSettings className="text-foreground" />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          <TbLogout className="text-foreground" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const NavBar = () => {
  return (
    <div className="flex justify-between p-4 border-b-1">
      <div className="flex items-center">
        <LuBrainCircuit className="text-primary" size={26} />
        <p className="text-2xl">OffloadIt</p>
      </div>
      <div className="flex gap-2">
        <ThemeToggle />
        <Menu />
      </div>
    </div>
  );
};
