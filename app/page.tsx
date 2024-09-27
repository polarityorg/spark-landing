import { BlockMath } from "react-katex";

import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Overview from "@/components/overview";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen max-w-3xl mx-auto p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/spark.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <p className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          A trust-minimized solution designed to scale Bitcoin and extend the
          Lightning Network.
        </p>
        <Separator />
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">
              Spark Overview
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex-1">
              Technical Overview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="w-full">
            <Overview />
          </TabsContent>
          <TabsContent value="technical" className="w-full">
            <div className="flex justify-center items-center h-full">
              <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <BlockMath
                  math={`K_{\\text{SO\\_old}} + K_{\\text{User\\_old}} = \\sum_{i=1}^{n} \\left( K_{\\text{User}_i} + K_{\\text{SO}_i} \\right)`}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer">
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer">
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
      </footer>
    </div>
  );
}
