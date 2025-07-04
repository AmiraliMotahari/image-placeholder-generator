"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { generatePlaceholderAction } from "./actions/generate-placeholder";

type ImageFile = {
  blobUrl: string;
  file: File;
};

export default function Home() {
  const [images, setImages] = useState<ImageFile[]>();
  const [results, setResults] = useState<string[] | undefined>();

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const filesList = target?.files ?? [];
    const fileArray: ImageFile[] = [];

    for (const file of filesList) {
      const blobUrl = URL.createObjectURL(file);

      fileArray.push({ file, blobUrl });
    }

    setImages(fileArray);
  };

  const onGenerate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!images) return;
    const results = await generatePlaceholderAction(images);
    setResults(results);
  };

  return (
    <div className="p-12 grid gap-12">
      <section className="grid gap-6">
        <Card>
          <CardContent>
            <form action="">
              <input
                type="file"
                placeholder="upload your image"
                onChange={onFileChange}
                accept="image/*"
                multiple
              />
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            {images?.map((image) => {
              return (
                <Image
                  key={image.file.name + image.file.size}
                  src={image.blobUrl}
                  alt=""
                  width={250}
                  height={250}
                  className="size-[250px] aspect-square object-center object-cover"
                />
              );
            })}
          </CardContent>
        </Card>
      </section>
      {images && images?.length > 0 ? (
        <section>
          <Card>
            <CardContent>
              <CardContent>
                <form onSubmit={onGenerate}>
                  <Button type="submit">Generate</Button>
                </form>
              </CardContent>
            </CardContent>
          </Card>
          {results && results?.length > 0 ? (
            <Card>
              <CardContent>
                {results?.map((image, i) => {
                  return (
                    <Image
                      key={image + "-" + i}
                      src={image}
                      alt=""
                      width={250}
                      height={250}
                      className="size-[250px] aspect-square object-center object-cover"
                    />
                  );
                })}
              </CardContent>
            </Card>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
