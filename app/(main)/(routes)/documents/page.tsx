"use client";

import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function DocumentsPage() {
    const { user } = useUser();

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image
                className="dark:hidden"
                src="/empty.png"
                alt="Empty"
                width="300"
                height="300"
            />

            <Image
                className="hidden dark:block"
                src="/empty-dark.png"
                alt="Empty"
                width="300"
                height="300"
            />

            <h2 className="text-lg font-medium">
                Welcome to {user?.firstName}&apos;s Jotion
            </h2>

            <Button>
                <PlusCircle className="h-4 w-4 mr-2" />

                Create a note
            </Button>
        </div>
    );
}
