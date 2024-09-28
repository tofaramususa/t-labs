'use client'

import Link from "next/link"
import { Logo } from "./icons/logo"
import { Container } from "./container";
import { Button } from "./button";
import { useEffect, useState } from "react";
import { HamburgerIcon } from "./icons/hamburger";
import classNames from "classnames";

export const Header = () => {
    const [hamburgerMenuIsOpen, setHamburgerMenuIsOpen] = useState(false);

    useEffect(() => {
        const html = document.querySelector('html');
        if(html) html.classList.toggle("overflow-hidden", hamburgerMenuIsOpen);
    }, [hamburgerMenuIsOpen]);

    useEffect(() => {
        const closeHamburgerNavigation = () => setHamburgerMenuIsOpen(false);
    
        window.addEventListener("orientationchange", closeHamburgerNavigation);
        window.addEventListener("resize", closeHamburgerNavigation);
    
        return () => {
          window.removeEventListener("orientationchange", closeHamburgerNavigation);
          window.removeEventListener("resize", closeHamburgerNavigation);
        };
      }, [setHamburgerMenuIsOpen]);
    
    return (
        <header className="fixed top-0 left-0 w-full border-b border-transparent-white backdrop-blur-[12px]">
            <Container className="flex h-navigation-height">
                <Link className="flex items-center text-lg" href="/">
                    <Logo className="mr-4 h-[1.8rem] w-[1.8rem]" /> Linear
                </Link> 
                <div className={classNames(
                    "md:block",
                    hamburgerMenuIsOpen ? "block" : "hidden"
                )}>
                    <nav className={classNames(
                        "fixed md:relative md:top-0 top-navigation-height left-0 w-full h-[calc(100vh-var(--navigation-height))] md:h-auto bg-background md:bg-transparent overflow-auto md:overflow-visible transition-opacity duration-300 ease-in-out",
                        hamburgerMenuIsOpen ? "opacity-100" : "opacity-0 md:opacity-100"
                    )}>
                        <ul className={classNames(
                            "flex flex-col md:flex-row md:items-center h-full [&_li]:ml-6 [&_li]:border-b [&_li]:border-grey-dark md:[&_li]:border-none", 
                            "[&_a]:h-navigation-height [&_a]:w-full [&_a]:flex [&_a]:items-center [&_a]:text-lg md:[&_a]:text-md [&_a:hover]:text  -grey",
                            "transition-[transform,opacity] duration-300 ease-in-out",
                            hamburgerMenuIsOpen ? "translate-y-0 opacity-100" : "translate-y-4 md:translate-y-0 md:opacity-100"
                        )}>
                            <li><Link href="#">Features</Link></li>
                            <li><Link href="#">Method</Link></li>
                            <li className="md:hidden lg:block"><Link href="#">Customers</Link></li>
                            <li className="md:hidden lg:block"><Link href="#">Changelog</Link></li>
                            <li className="md:hidden lg:block"><Link href="#">Integrations</Link></li>
                            <li><Link href="#">Pricing</Link></li>
                            <li><Link href="#">Company</Link></li>
                        </ul>
                    </nav>
                </div>
                <div className="ml-auto h-full flex items-center">
                    <Link className="text-md mr-6" href="#">Log in</Link>
                    <Button href="#">Sign Up</Button>
                </div>
                <button className="ml-6 md:hidden" onClick={() => setHamburgerMenuIsOpen((open) => !open)}>
                    <span className="sr-only">Toggle Menu</span>
                    <HamburgerIcon />
                </button>
            </Container>
        </header> 
    );
}