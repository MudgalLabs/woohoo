export const APP_TITLE =
    "Woohoo — Follow-up tool for social media DMs and comments";
export const APP_DESCRIPTION =
    "Save the DMs and comments that matter in one click, organized by person, with follow-up reminders. Never let a warm lead go cold.";

interface Route {
    title: string;
    url: string;
    protected?: boolean;
}

export const ROUTES: Route[] = [
    {
        title: "Dashboard",
        url: "/dashboard",
        protected: true,
    },
    {
        title: "My Woohoos",
        url: "/my-woohoos",
        protected: true,
    },
    {
        title: "Plan & usage",
        url: "/settings/plan",
        protected: true,
    },
];

export const ROUTES_MAP = Object.fromEntries(
    ROUTES.map((route) => [route.url, route]),
) as Record<Route["url"], Route>;
