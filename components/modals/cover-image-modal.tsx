"use client";

import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { useCoverImage } from "@/hooks/use-cover-image";
import { useEdgeStore } from "@/lib/edgestore";

import { SingleImageDropzone } from "../single-image-dropzone";

export function CoverImageModal() {
    const params = useParams();
    const update = useMutation(api.documents.update);
    const coverImage = useCoverImage();
    const { edgestore } = useEdgeStore();

    const [file, setFile] = useState<File>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onChange(file?: File) {
        if (file) {
            setIsSubmitting(true);
            setFile(file);

            const res = await edgestore.publicFiles.upload({
                file,
                options: {
                    replaceTargetUrl: coverImage.url,
                },
            });

            await update({
                id: params.documentId as Id<"documents">,
                coverImage: res.url,
            });

            onClose()
        }
    }

    function onClose() {
        setFile(undefined);
        setIsSubmitting(false);

        coverImage.onClose();
    }

    return (
        <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
            <DialogContent>
                <DialogHeader>
                    <h2 className="text-center text-lg font-semibold">
                        Cover Image
                    </h2>
                </DialogHeader>

                <SingleImageDropzone
                    className="w-full outline-none"
                    disabled={isSubmitting}
                    value={file}
                    onChange={onChange}
                />
            </DialogContent>
        </Dialog>
    );
}
