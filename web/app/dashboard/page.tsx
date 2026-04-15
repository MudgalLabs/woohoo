"use client";

import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
    const handleOnClick = () => {
        authClient.signOut();
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleOnClick}>Sign Out</button>
        </div>
    );
}
