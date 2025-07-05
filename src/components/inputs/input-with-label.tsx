import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { InputHTMLAttributes } from "react";
import { Path, useFormContext } from "react-hook-form";

type InputWithLabelProps<S> = {
  nameInSchema: Path<S>;
  fieldTitle: string;
  description?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

function InputWithLabel<S>({
  nameInSchema,
  fieldTitle,
  description,
  className,
  ...props
}: InputWithLabelProps<S>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem className={cn("", className)}>
          <FormLabel>{fieldTitle}</FormLabel>
          <FormControl>
            <Input {...field} {...props} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default InputWithLabel;
