"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";

interface ConfirmModalProps {
    children: React.ReactNode;
    onConfirm: () => void;
};

export function ConfirmModal({ children, onConfirm }: ConfirmModalProps) {
    function handleConfirm(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation();

        onConfirm();
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger
                onClick={(event) => event.stopPropagation()}
                asChild
            >
                {children}
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={(event) => event.stopPropagation()}>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction onClick={handleConfirm}>
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
