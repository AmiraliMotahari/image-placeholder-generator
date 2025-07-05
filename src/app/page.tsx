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
import { useCallback, useEffect, useState } from "react";
import { generatePlaceholderAction } from "./actions/generate-placeholder";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import {
  createPlaceholderSchema,
  CreatePlaceholderSchema,
} from "@/lib/zod-schemas/generate-placeholder";
import { useForm, UseFormReturn } from "react-hook-form";
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
import { DropzoneOptions } from "react-dropzone";

const DROPZONE_OPTIONS: DropzoneOptions = {
  maxFiles: 10,
  maxSize: 10 * 1024 * 1024, // 10MB
  multiple: true,
  accept: {
    "image/*": [".png", ".jpeg", ".webp", ".tiff"],
  },
};

export default function Home() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [results, setResults] = useState<string[] | undefined>([]);

  const form = useForm<CreatePlaceholderSchema>({
    resolver: zodResolver(createPlaceholderSchema),
    defaultValues: {
      imageFiles: [],
    },
  });

  const onFileChange = useCallback(
    (files: File[] | null) => {
      if (!files) return;
      const fileEntries: ImageFile[] = files.map((file) => ({
        file,
        blobUrl: URL.createObjectURL(file),
      }));

      setImages(fileEntries);
      form.setValue("imageFiles", fileEntries, { shouldValidate: true });
    },
    [form]
  );

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

  const onSubmit = useCallback(
    (values: CreatePlaceholderSchema) => {
      execute(values);
    },
    [execute]
  );

  // Cleanup blob URLs on unmount or images change
  useEffect(() => {
    return () => {
      images?.forEach(({ blobUrl }) => URL.revokeObjectURL(blobUrl));
    };
  }, [images]);

  return (
    <div className="w-full p-12 grid gap-12">
      {/* Upload Section */}
      <UploadSection
        images={images}
        onFileChange={onFileChange}
        onSubmit={form.handleSubmit(onSubmit)}
        form={form}
        isPending={isPending}
      />

      {/* Results */}
      {results && results?.length > 0 ? (
        <ResultsSection results={results} />
      ) : null}
    </div>
  );
}

type UploadSectionProps = {
  images: ImageFile[];
  onFileChange: (files: File[] | null) => void;
  onSubmit: () => void;
  form: UseFormReturn<CreatePlaceholderSchema>;
  isPending: boolean;
};

function UploadSection({
  images,
  onFileChange,
  onSubmit,
  isPending,
  form,
}: UploadSectionProps) {
  return (
    <section className="w-full grid gap-6">
      <Card className="max-w-full overflow-hidden">
        <CardHeader>
          <CardTitle>Generate Image Placeholder</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
              <FileUploader
                value={images.map((img) => img.file)}
                onValueChange={onFileChange}
                dropzoneOptions={DROPZONE_OPTIONS}
                className="relative bg-background rounded-lg p-2"
              >
                <FileInput className="outline-dashed outline-1 outline-white">
                  <div className="flex flex-col items-center justify-center py-4 w-full">
                    <FileSvgDraw />
                  </div>
                </FileInput>

                <FileUploaderContent>
                  {images.map(({ file }, idx) => (
                    <FileUploaderItem key={file.name + idx} index={idx}>
                      {file.name}
                    </FileUploaderItem>
                  ))}
                </FileUploaderContent>
              </FileUploader>

              <Button type="submit" disabled={isPending || images.length === 0}>
                {isPending ? (
                  <span className="flex items-center gap-2">
                    Generating...
                    <LoaderCircle className="animate-spin" />
                  </span>
                ) : (
                  "Generate"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        {images.length > 0 && (
          <CardFooter>
            <ScrollArea className="w-full overflow-x-auto rounded-md border">
              <div className="flex w-max gap-4 p-3">
                {images.map(({ blobUrl, file }) => (
                  <Image
                    key={file.name + file.size}
                    src={blobUrl}
                    alt={file.name}
                    width={200}
                    height={200}
                    className="h-50 w-50 object-cover rounded"
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardFooter>
        )}
      </Card>
    </section>
  );
}

type ResultsSectionProps = {
  results: string[];
};

function ResultsSection({ results }: ResultsSectionProps) {
  return (
    <section className="w-full">
      <Card>
        <CardContent>
          <ScrollArea className="w-full overflow-x-auto rounded-md border">
            <div className="flex w-max gap-4 p-3">
              {results.map((url, idx) => (
                <ResultCard key={`${url}-${idx}`} imageUrl={url} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </section>
  );
}
