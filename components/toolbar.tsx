"use client";

import { useMutation } from "convex/react";
import { ImageIcon, Smile, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { useCoverImage } from "@/hooks/use-cover-image";

import { IconPicker } from "./icon-picker";
import { Button } from "./ui/button";

interface ToolbarProps {
    initialData: Doc<"documents">;
    preview?: boolean;
};

export function Toolbar({ initialData, preview }: ToolbarProps) {
    const inputRef = useRef<ElementRef<"textarea">>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialData.title);

    const update = useMutation(api.documents.update);
    const removeIcon = useMutation(api.documents.removeIcon);

    const coverImage = useCoverImage();

    function enableInput() {
        if (preview) return;

        setIsEditing(true);
        setTimeout(() => {
            setValue(initialData.title);

            inputRef.current?.focus();
        }, 0);
    }

    function disableInput() {
        setIsEditing(false);
    }

    function onInput(value: string) {
        setValue(value);

        update({
            id: initialData._id,
            title: value || "Untitled",
        });
    }

    function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === "Enter") {
            event.preventDefault();

            disableInput();
        }
    }

    function onIconSelect(icon: string) {
        update({
            id: initialData._id,
            icon,
        });
    }

    function onRemoveIcon() {
        removeIcon({
            id: initialData._id,
        });
    }

    return (
        <div className="pl-[54px] group relative">
            {!!initialData.icon && !preview && (
                <div className="flex items-center gap-x-2 group/icon pt-6">
                    <IconPicker onChange={onIconSelect}>
                        <p className="text-6xl hover:opacity-75 transition">
                            {initialData.icon}
                        </p>
                    </IconPicker>

                    <Button
                        className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
                        variant="outline"
                        size="icon"
                        onClick={onRemoveIcon}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {!!initialData.icon && preview && (
                <p className="text-6xl pt-6">
                    {initialData.icon}
                </p>
            )}

            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
                {!initialData.icon && !preview && (
                    <IconPicker
                        asChild
                        onChange={onIconSelect}
                    >
                        <Button
                            className="text-muted-foreground text-xs"
                            variant="outline"
                            size="sm"
                        >
                            <Smile className="h-4 w-4 mr-2" />

                            Add icon
                        </Button>
                    </IconPicker>
                )}

                {!initialData.coverImage && !preview && (
                    <Button
                        className="text-muted-foreground text-xs"
                        variant="outline"
                        size="sm"
                        onClick={coverImage.onOpen}
                    >
                        <ImageIcon className="h-4 w-4 mr-2" />

                        Add cover
                    </Button>
                )}
            </div>

            {isEditing && !preview ? (
                <TextareaAutosize
                    ref={inputRef}
                    className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
                    value={value}
                    onChange={(event) => onInput(event.target.value)}
                    onBlur={disableInput}
                    onKeyDown={onKeyDown}
                />
            ) : (
                <div
                    className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
                    onClick={enableInput}
                >
                    {initialData.title}
                </div>
            )}
        </div>
    );
}
