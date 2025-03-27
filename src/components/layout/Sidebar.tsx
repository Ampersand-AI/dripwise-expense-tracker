
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart4, 
  CreditCard, 
  FileText, 
  Home, 
  Receipt, 
  Settings, 
  Upload 
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
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
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

  return (
    <ShadcnSidebar>
      <SidebarHeader className="flex items-center justify-center p-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="bg-primary/10 text-primary p-2 rounded-md">
            <CreditCard className="h-6 w-6" />
          </span>
          <span className="text-xl font-semibold">Drip</span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <Link 
                      to={item.path} 
                      className={cn(
                        "flex items-center space-x-3 py-2 px-3 rounded-md transition-colors",
                        isActive(item.path) 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-accent"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="pb-4 px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/settings')}>
              <Link
                to="/settings"
                className={cn(
                  "flex items-center space-x-3 py-2 px-3 rounded-md transition-colors",
                  isActive('/settings') 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-accent"
                )}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;
