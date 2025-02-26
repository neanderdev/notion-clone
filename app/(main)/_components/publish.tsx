"use client";

import { useMutation } from "convex/react";
import { Check, Copy, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { 
    Popover, 
    PopoverTrigger, 
    PopoverContent, 
} from "@/components/ui/popover";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { useOrigin } from "@/hooks/use-origin";

interface PublishProps {
    initialData: Doc<"documents">;
};

export function Publish({ initialData }: PublishProps) {
    const origin = useOrigin();
    const update = useMutation(api.documents.update);

    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const url = `${origin}/preview/${initialData._id}`;

    function onPublish() {
        setIsSubmitting(true);

        const promise = update({
            id: initialData._id,
            isPublished: true,
        })
            .then(() => setIsSubmitting(false));

        toast.promise(promise, {
            loading: "Publishing...",
            success: "Note published",
            error: "Failed to publish note.",
        });
    }

    function onUnpublish() {
        setIsSubmitting(true);

        const promise = update({
            id: initialData._id,
            isPublished: false,
        })
            .then(() => setIsSubmitting(false));

        toast.promise(promise, {
            loading: "Unpublishing...",
            success: "Note unpublished",
            error: "Failed to unpublish note.",
        });
    }

    function onCopy() {
        navigator.clipboard.writeText(url);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" variant="ghost">
                    Publish

                    {initialData.isPublished && (
                        <Globe
                            className="text-sky-500 w-4 h-4 ml-2"
                        />
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent 
                className="w-72" 
                align="end" 
                alignOffset={8} 
                forceMount 
            >
                {initialData.isPublished ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-x-2">
                            <Globe className="text-sky-500 animate-pulse h-4 w-4" /> 

                            <p className="text-xs font-medium text-sky-500">
                                This note is live on web.
                            </p>
                        </div>

                        <div className="flex items-center">
                            <input 
                                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                                value={url}
                                disabled
                            />

                            <Button 
                                className="h-8 rounded-l-none" 
                                onClick={onCopy} 
                                disabled={copied} 
                            >
                                {copied ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>

                        <Button
                            className="w-full text-xs"
                            size="sm"
                            onClick={onUnpublish}
                            disabled={isSubmitting}
                        >
                            Unpublish
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <Globe 
                            className="w-8 h-8 text-muted-foreground mb-2"
                        />

                        <p className="text-sm font-medium mb-2">
                            Publish this note
                        </p>

                        <span className="text-xs text-muted-foreground mb-4">
                            Share your work with others.
                        </span>

                        <Button
                            className="w-full text-xs"
                            size="sm"
                            onClick={onPublish}
                            disabled={isSubmitting}
                        >
                            Publish
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
