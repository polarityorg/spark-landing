import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Overview from "@/components/overview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen max-w-3xl mx-auto p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 pb-8 row-start-2 sm:items-start">
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
          Lightning Network.
        </p>
        <Separator />
        {/* disclaimer */}
        {/* <div className="flex flex-col gap-2 text-sm text-left text-muted-foreground">
          <h5 className="font-bold text-sm">Disclaimer</h5>
          <p>
            Typically, when a new scaling solution is introduced to the
            community, less than 1% of people end up reading it given how
            overwhelming the material can be. We&apos;ve tried something
            different; this version is an attempt to speak to multiple
            audiences.
          </p>
          <p>Please keep us honest — any and all feedback is welcome.</p>
        </div> */}
        <div className="flex w-full border border-gray-300 shadow-sm rounded-md p-2">
          <Input
            placeholder="Email"
            type="email"
            className="flex-1 border-none focus:ring-0 focus-visible:ring-0 focus:border-gray-300 shadow-none"
          />
          <Button className="ml-2 px-4 py-2 rounded-md w-1/3">
            Build on Spark
          </Button>
        </div>
        <Overview />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <Image
          src="/spark.svg"
          alt="Spark logo"
          width={75}
          height={15}
          priority
        />
      </footer>
    </div>
  );
}
