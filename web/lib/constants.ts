export const APP_TITLE = "You saw it. You meant to act on it. It's gone.";
export const APP_DESCRIPTION =
    "Capture what matters in one click. Get reminded to follow up before the moment goes cold.";

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
