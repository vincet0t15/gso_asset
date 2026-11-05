import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Boxes, Building2, ClipboardList, FolderGit2, Layers, LayoutGrid, Package, Tags } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as brands } from '@/routes/brands';
import { index as categories } from '@/routes/categories';
import { index as items } from '@/routes/items';
import { index as models } from '@/routes/models';
import { index as offices } from '@/routes/offices';
import { index as ppeClassifications } from '@/routes/ppe-classifications';
import type { Auth, NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        ...(auth.permissions.includes('categories.view')
            ? [
                  {
                      title: 'Categories',
                      href: categories.url(),
                      icon: Layers,
                  },
              ]
            : []),
        ...(auth.permissions.includes('items.view')
            ? [
                  {
                      title: 'Items',
                      href: items.url(),
                      icon: Package,
                  },
              ]
            : []),
        ...(auth.permissions.includes('brands.view')
            ? [
                  {
                      title: 'Brands',
                      href: brands.url(),
                      icon: Tags,
                  },
              ]
            : []),
        ...(auth.permissions.includes('models.view')
            ? [
                  {
                      title: 'Models',
                      href: models.url(),
                      icon: Boxes,
                  },
              ]
            : []),
        ...(auth.permissions.includes('offices.view')
            ? [
                  {
                      title: 'Offices',
                      href: offices.url(),
                      icon: Building2,
                  },
              ]
            : []),
        ...(auth.permissions.includes('ppe_classifications.view')
            ? [
                  {
                      title: 'PPE classifications',
                      href: ppeClassifications.url(),
                      icon: ClipboardList,
                  },
              ]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>


        </Sidebar>
    );
}
