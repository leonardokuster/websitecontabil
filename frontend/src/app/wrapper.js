"use client";

import React from "react";
import BackToTopButton from "@/components/backToTop/backToTopButton";

export default function Wrapper({ children }) {
    return (
        <>
            {children}
            <BackToTopButton />
        </>
    );
}
