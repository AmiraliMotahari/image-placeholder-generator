import { cn } from "@/lib/utils";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Copy, MoreHorizontal } from "lucide-react";
import CopyToClipBoard from "../copy-to-clipboard";

type Props = {
  imageUrl: string;
  className?: string;
};

const ResultCard = ({ imageUrl, className }: Props) => {
  return (
    <div
      className={cn(
        "size-[200px] aspect-square relative rounded-lg overflow-hidden",
        className
      )}
    >
      <Image
        src={imageUrl ?? "/placeholder.svg"}
        alt="Generated Placeholder"
        className="size-[200px] object-center object-cover"
        width={200}
        height={200}
      />
      <div className="absolute top-2 right-2 space-x-2">
        <CopyToClipBoard
          valueToCopy={imageUrl}
          size={"icon"}
          variant={"secondary"}
          className="rounded-full"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"secondary"}
              size={"icon"}
              className="rounded-full"
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ResultCard;
