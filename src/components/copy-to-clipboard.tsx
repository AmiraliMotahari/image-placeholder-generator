"use client";

import { Button, ButtonProps } from "./ui/button";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Clipboard } from "lucide-react";

type Props = {
  valueToCopy: string;
} & Omit<ButtonProps, "onClick">;

const CopyToClipBoard = ({ valueToCopy, ...props }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(valueToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="outline" onClick={handleCopy} {...props}>
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Clipboard className="w-4 h-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CopyToClipBoard;
