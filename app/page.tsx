import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Overview from "@/components/overview";
import TechnicalOverview from "@/components/technical";

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const defaultTab =
    searchParams.technical !== undefined ? "technical" : "overview";

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen max-w-3xl mx-auto p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 pb-8 row-start-2 sm:items-start">
        {/* <p className="text-sm text-left text-muted-foreground sm:text-left font-[family-name:var(--font-geist-mono)]">
          A{" "}
          <a
            href="https://lightspark.com"
            className="hover:underline hover:underline-offset-4"
            target="_blank">
            Lightspark
          </a>{" "}
          &{" "}
          <a
            href="https://flashnet.xyz"
            className="hover:underline hover:underline-offset-4"
            target="_blank">
            Polarity
          </a>{" "}
          initiative
        </p> */}
        <Image
          className="dark:invert"
          src="/spark.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <p className="text-sm text-left sm:text-left font-[family-name:var(--font-geist-mono)]">
          A trust-minimized solution designed to scale Bitcoin and extend the
          Lightning Network
        </p>
        <Separator />
        <Tabs defaultValue={defaultTab} className="w-full">
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
            <TechnicalOverview />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/"
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
          href="/?technical"
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
