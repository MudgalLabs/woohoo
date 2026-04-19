import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import { getActiveWoohooCount, getUserPlan } from "@/lib/plans";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInset,
    SidebarProvider,
    SidebarRail,
} from "@/components/ui/sidebar";
import { AppNav } from "./AppNav";
import { AppHeader } from "./AppHeader";
import { AppSidebarFooter } from "./AppSidebarFooter";
import { SidebarUsage } from "./SidebarUsage";
import { Logo } from "@/app/components/brand/Logo";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session) redirect("/sign-in");

    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

    const [plan, activeCount] = await Promise.all([
        getUserPlan(session.user.id),
        getActiveWoohooCount(session.user.id),
    ]);

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <Logo
                        href="/dashboard"
                        className="px-2 py-1 group-data-[collapsible=icon]:hidden"
                    />
                    <Logo
                        href="/dashboard"
                        variant="mark"
                        size="sm"
                        className="hidden group-data-[collapsible=icon]:flex justify-center py-1"
                    />
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <AppNav />
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarUsage
                    planName={plan.name}
                    activeCount={activeCount}
                    limit={plan.activeWoohooLimit}
                />

                <SidebarRail />
                <AppSidebarFooter
                    user={{
                        name: session.user.name,
                        email: session.user.email,
                        image: session.user.image,
                    }}
                />
            </Sidebar>

            <SidebarInset>
                <AppHeader />
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
