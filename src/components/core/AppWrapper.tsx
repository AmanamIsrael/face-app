"use client";
import { AppType } from "@/app/api/[[...route]]/route";
import { systemPrompt } from "@/constants/message";
import { hc } from "hono/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ImageResults } from "./ImageResults";
import { ImageUpload } from "./ImageUpload";

export const AppWrapper = async () => {
  const client = hc<AppType>("http://localhost:3000/");

  const handleSubmit = async (image: string) => {
    const response = await client.api.answer.$post({
      form: {
        message: systemPrompt,
      },
    });

    if (response.status !== 200) {
      const data = response.json();

      console.error(data);
      toast.error("An error occurred");
    }

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      // pass the data to the result component and do some magic
    }
  };

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle className="text-center text-foreground text-2xl">
          Upload Image
        </CardTitle>
        <CardContent className="grid gap-4">
          <ImageUpload onUpload={handleSubmit} />
          <ImageResults />
        </CardContent>
      </CardHeader>
    </Card>
  );
};
