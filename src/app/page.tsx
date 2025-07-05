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
import { useState } from "react";
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
import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";
import { ImageFile } from "@/lib/types";
import ResultCard from "@/components/cards/results-card";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/inputs/file-upload";
import {
  CloudUpload,
  LoaderCircle,
  LoaderCircleIcon,
  Paperclip,
} from "lucide-react";
import FileSvgDraw from "@/components/file-svg-draw";

export default function Home() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [images, setImages] = useState<ImageFile[]>();
  const [results, setResults] = useState<string[] | undefined>();

  const dropZoneConfig = {
    maxFiles: 20,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  const form = useForm<CreatePlaceholderSchema>({
    resolver: zodResolver(createPlaceholderSchema),
    defaultValues: {
      imageFiles: [],
    },
  });

  const onFileChange = (imageFiles: File[] | null) => {
    if (!imageFiles) return;
    const fileArray: ImageFile[] = [];

    for (const file of imageFiles) {
      const blobUrl = URL.createObjectURL(file);

      fileArray.push({ file, blobUrl });
    }

    setImages(fileArray);
    setFiles(imageFiles);
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
        setFiles(null);
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
        <Card className="max-w-full overflow-hidden">
          <CardHeader>
            <CardTitle>Generate Image Placeholder</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <FileUploader
                  value={files}
                  onValueChange={onFileChange}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-2"
                >
                  <FileInput className="outline-dashed outline-1 outline-white">
                    <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                      <FileSvgDraw />
                    </div>
                  </FileInput>
                  <FileUploaderContent>
                    {files &&
                      files.length > 0 &&
                      files.map((file, i) => (
                        <FileUploaderItem key={i} index={i}>
                          <Paperclip className="h-4 w-4 stroke-current" />
                          <span>{file.name}</span>
                        </FileUploaderItem>
                      ))}
                  </FileUploaderContent>
                </FileUploader>
                <Button
                  type="submit"
                  disabled={isPending || !images || images?.length < 1}
                >
                  {isPending ? (
                    <p className="flex justify-center items-center gap-1">
                      <span>Generating...</span>
                      <LoaderCircle className="animate-spin" />
                    </p>
                  ) : (
                    "Generate"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          {images && images?.length > 0 ? (
            <CardFooter>
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
