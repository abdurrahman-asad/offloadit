import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from '@ui';
import { TbUserCircle, TbLogout } from 'react-icons/tb';
import { Link, useNavigate, useLocation } from 'react-router';
import { ThemeToggle } from './ThemeToggle';
import { supabase } from '@sb';
import { toast } from '@ui';
import { LuBrainCircuit } from 'react-icons/lu';
// import { useAuth } from '../../hooks';

function Menu() {
  const navigate = useNavigate();
  // const { user } = useAuth();
  const avatarUrl = null; //user?.user_metadata?.avatar_url;

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
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center cursor-pointer">
          {avatarUrl ? (
            <img src={avatarUrl} alt="User Avatar" className="w-full h-full rounded-full" />
          ) : (
            <TbUserCircle size={24} />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="*:cursor-pointer **:text-[1rem]" align="end">
        {/* <Link to="/settings">
          <DropdownMenuItem className="cursor-pointer">
            <TbSettings className="text-foreground" />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          <TbLogout className="text-foreground" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const NavBar = () => {
  const location = useLocation();

  const isActive = (path: string) => (location.pathname === path ? 'text-primary' : '');

  return (
    <div className="flex justify-between p-4 border-b-1">
      <Link to="/">
        <div className="flex items-center">
          <LuBrainCircuit className="text-primary" size={26} />
          <p className="text-2xl">OffloadIt</p>
        </div>
      </Link>
      <div className="flex items-center gap-8 *:hover:text-primary font-semibold">
        <Link to="/" className={isActive('/')}>
          Home
        </Link>
        {/* <Link to="/scheduled-agents" className={isActive('/scheduled-agents')}>
          Scheduled Agents
        </Link> */}
      </div>
      <div className="flex gap-2">
        <ThemeToggle />
        <Menu />
      </div>
    </div>
  );
};
