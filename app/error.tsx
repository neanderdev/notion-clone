"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Error() {
    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image
                className="dark:hidden"
                src="/error.png"
                alt="Error"
                width="300"
                height="300"
            />

            <Image
                className="hidden dark:block"
                src="/error-dark.png"
                alt="Error"
                width="300"
                height="300"
            />

            <h2 className="text-xl font-medium">
                Something went wrong!
            </h2>

            <Button asChild>
                <Link href="/documents">
                    Go back
                </Link>
            </Button>
        </div>
    );
}
