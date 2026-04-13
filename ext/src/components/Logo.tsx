import LogoSrc from "@/assets/logo.svg";
import { ComponentProps } from "react";

export function Logo(props: ComponentProps<"img">) {
    return <img src={LogoSrc} {...props} />;
}
