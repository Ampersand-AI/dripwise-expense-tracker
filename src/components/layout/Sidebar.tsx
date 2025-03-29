import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart4, 
  CreditCard, 
  FileText, 
  Home, 
  Receipt, 
  Settings, 
  Upload,
  LogIn,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { 
  Sidebar as ShadcnSidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarTrigger, 
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';

const Sidebar = () => {
  const location = useLocation();
  const { isSignedIn } = useAuth();
  const { toggleSidebar, open, setOpen } = useSidebar();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const authenticatedMenuItems = [
    {
      title: 'Home',
      icon: Home,
      path: '/',
    },
    {
      title: 'Upload',
      icon: Upload,
      path: '/upload',
    },
    {
      title: 'Expenses',
      icon: Receipt,
      path: '/expenses',
    },
    {
      title: 'Budgets',
      icon: CreditCard,
      path: '/budgets',
    },
    {
      title: 'Reports',
      icon: BarChart4,
      path: '/reports',
    },
    {
      title: 'Tax',
      icon: FileText,
      path: '/tax',
    },
  ];

  const unauthenticatedMenuItems = [
    {
      title: 'Home',
      icon: Home,
      path: '/',
    },
    {
      title: 'Sign In',
      icon: LogIn,
      path: '/sign-in',
    },
    {
      title: 'Sign Up',
      icon: UserPlus,
      path: '/sign-up',
    },
  ];

  const menuItems = isSignedIn ? authenticatedMenuItems : unauthenticatedMenuItems;

  return (
    <ShadcnSidebar className="shadow-none">
      <SidebarHeader className="flex items-center justify-between p-4">
        {open ? (
          <>
            <Link to="/" className="flex items-center space-x-2">
              <span className="bg-primary/10 text-primary p-2 rounded-md">
                <CreditCard className="h-6 w-6" />
              </span>
              <span className="text-xl font-semibold">Drip</span>
            </Link>
          </>
        ) : (
          <div className="flex flex-col items-center w-full space-y-2">
            <Link to="/" className="flex items-center justify-center">
              <span className="bg-primary/10 text-primary p-2 rounded-md">
                <CreditCard className="h-6 w-6" />
              </span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setOpen(true)}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          {open && <SidebarGroupLabel>Navigation</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <Link 
                      to={item.path} 
                      className={cn(
                        "flex items-center py-2 px-3 rounded-md transition-colors",
                        open ? "space-x-3" : "justify-center",
                        isActive(item.path) 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-accent"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {open && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SignedIn>
        <SidebarFooter className="pb-4 px-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/settings')}>
                <Link
                  to="/settings"
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md transition-colors",
                    open ? "space-x-3" : "justify-center",
                    isActive('/settings') 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-accent"
                  )}
                >
                  <Settings className="h-5 w-5" />
                  {open && <span>Settings</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SignedIn>
    </ShadcnSidebar>
  );
};

export default Sidebar;
