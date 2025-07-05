"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { generatePlaceholderAction } from "./actions/generate-placeholder";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import {
  createPlaceholderSchema,
  CreatePlaceholderSchema,
} from "@/lib/zod-schemas/generate-placeholder";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";
import { ImageFile } from "@/lib/types";
import ResultCard from "@/components/cards/results-card";

export default function Home() {
  const [images, setImages] = useState<ImageFile[]>();
  const [results, setResults] = useState<string[] | undefined>();

  const form = useForm<CreatePlaceholderSchema>({
    resolver: zodResolver(createPlaceholderSchema),
    defaultValues: {
      imageFiles: [],
    },
  });

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const filesList = target?.files ?? [];
    const fileArray: ImageFile[] = [];

    for (const file of filesList) {
      const blobUrl = URL.createObjectURL(file);

      fileArray.push({ file, blobUrl });
    }

    setImages(fileArray);
    form.setValue("imageFiles", fileArray);
  };

  const { execute, isPending } = useAction(generatePlaceholderAction, {
    onError({ error }) {
      if (error) {
        toast.error("Error", {
          description:
            error.serverError ??
            "Unable to generate the requested image. Please try again later.",
        });
      }
    },
    onSuccess({ data }) {
      if (data) {
        console.log(results);

        setResults(data.results);
        toast.success("Success", {
          description: data.message,
        });
        form.reset();
        setImages([]);
      }
    },
  });

  const onSubmit = (values: CreatePlaceholderSchema) => {
    execute(values);
  };

  return (
    <div className="w-full p-12 grid gap-12">
      {/* Upload Section */}
      <section className="w-full grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Image Placeholder</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-6"
              >
                <Input
                  name="imageFiles"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={onFileChange}
                />
                <Button
                  type="submit"
                  disabled={isPending || !images || images?.length < 1}
                >
                  Generate
                </Button>
              </form>
            </Form>
          </CardContent>
          {(images && images?.length > 0) ? (
            <CardFooter className="max-w-full overflow-hidden">
              <ScrollArea className="w-full rounded-md border whitespace-nowrap">
                <div className="flex gap-4 p-3">
                  {images?.map((image) => {
                    return (
                      <Image
                        key={image.file.name + image.file.size}
                        src={image.blobUrl ?? "/placeholder.svg"}
                        alt=""
                        width={200}
                        height={200}
                        className="size-[200px] aspect-square object-center object-cover"
                      />
                    );
                  })}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardFooter>
          ) : null}
        </Card>
      </section>
      {/* Results */}
      {results && results?.length > 0 ? (
        <section className="max-w-full overflow-hidden">
          <Card>
            <CardContent>
              <ScrollArea className="w-full rounded-md border whitespace-nowrap">
                <div className="flex gap-4 p-3">
                  {results.map((image, i) => {
                    return (
                      <ResultCard key={image + "-" + i} imageUrl={image} />
                    );
                  })}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
