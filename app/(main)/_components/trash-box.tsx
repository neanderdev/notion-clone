"use client";

import { useMutation, useQuery } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function TrashBox() {
    const router = useRouter();
    const params = useParams();
    const documents = useQuery(api.documents.getTrash);
    const restore = useMutation(api.documents.restore);
    const remove = useMutation(api.documents.remove);

    const [search, setSearch] = useState("");

    const filteredDocuments = documents?.filter((document) => {
        return document.title.toLowerCase().includes(search.toLowerCase());
    });

    function onClick(documentId: string) {
        router.push(`/documents/${documentId}`);
    }

    function onRestore(
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        documentId: Id<"documents">,
    ) {
        event.stopPropagation();

        const promise = restore({ id: documentId });

        toast.promise(promise, {
            loading: "Restoring note...",
            success: "Note restored!",
            error: "Failed to restore note.",
        });
    }

    function onRemove(documentId: Id<"documents">) {
        const promise = remove({ id: documentId });

        toast.promise(promise, {
            loading: "Deleting note...",
            success: "Note deleted!",
            error: "Failed to delete note.",
        });

        if (params.documentId === documentId) {
            router.push("/documents");
        }
    }

    if (documents === undefined) {
        return (
            <div className="h-full flex items-center justify-normal p-4">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="text-sm">
            <div className="flex items-center gap-x-1 p-2">
                <Search className="h-4 w-4" />

                <Input
                    className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Filter by page title...."
                />
            </div>

            <div className="mt-2 px-1 pb-1">
                <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
                    No documents found.
                </p>

                {filteredDocuments?.map((document, index) => (
                    <div
                        key={index}
                        className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
                        role="button"
                        onClick={() => onClick(document._id)}
                    >
                        <span className="truncate pl-2">
                            {document.title}
                        </span>

                        <div className="flex items-center">
                            <div
                                className="rounded-sm p-2 hover:bg-neutral-200"
                                role="button"
                                onClick={(event) => onRestore(event, document._id)}
                            >
                                <Undo className="h-4 w-4 text-muted-foreground" />
                            </div>

                            <ConfirmModal onConfirm={() => onRemove(document._id)}>
                                <div
                                    className="rounded-sm p-2 hover:bg-neutral-200"
                                    role="button"
                                >
                                    <Trash className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </ConfirmModal>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
