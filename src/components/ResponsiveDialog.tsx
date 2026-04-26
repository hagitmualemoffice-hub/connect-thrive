import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer as DrawerPrimitive } from "vaul";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ResponsiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Classes applied to the inner container (Dialog content / Drawer content). */
  contentClassName?: string;
  /** Classes applied only on desktop (Dialog). */
  desktopContentClassName?: string;
  /** Classes applied only on mobile (Drawer). */
  mobileContentClassName?: string;
  children: React.ReactNode;
}

/**
 * Renders content inside a centered Dialog on desktop and a bottom Drawer on mobile.
 * Preserves visual styling of children - only the surrounding chrome changes.
 */
export const ResponsiveDialog = ({
  open,
  onOpenChange,
  contentClassName,
  desktopContentClassName,
  mobileContentClassName,
  children,
}: ResponsiveDialogProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DrawerPrimitive.Root open={open} onOpenChange={onOpenChange} shouldScaleBackground>
        <DrawerPrimitive.Portal>
          <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60" />
          <DrawerPrimitive.Content
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 flex h-auto max-h-[92vh] flex-col rounded-t-[28px] bg-card overflow-hidden shadow-[0_-20px_60px_-10px_hsl(0_0%_0%_/_0.25)]",
              contentClassName,
              mobileContentClassName,
            )}
          >
            <DrawerPrimitive.Title className="sr-only">פתיחה</DrawerPrimitive.Title>
            <div className="mx-auto mt-2.5 mb-1 h-1.5 w-12 rounded-full bg-muted shrink-0" />
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              {children}
            </div>
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Portal>
      </DrawerPrimitive.Root>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className={cn(
          "max-w-[820px] p-0 overflow-hidden rounded-[32px] border-0 bg-card shadow-[0_32px_64px_-16px_hsl(0_0%_0%_/_0.18)] max-h-[92vh] flex flex-col gap-0",
          contentClassName,
          desktopContentClassName,
        )}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ResponsiveDialog;
