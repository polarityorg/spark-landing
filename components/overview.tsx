"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InlineMath } from "react-katex";

const Overview = () => {
  const [, setActiveSection] = useState("");

  const sections = [
    { id: "spark-tldr", title: "Spark TLDR" },
    { id: "why", title: "Why?" },
    { id: "how-it-works", title: "How does it work?" },
    { id: "spark-ux", title: "Spark UX" },
    { id: "faq", title: "FAQ" },
  ];

  const handleClick = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="font-[family-name:var(--font-geist-sans)] max-w-3xl mx-auto pt-8">
      {/* outline */}
      <h5 className="font-bold text-sm">Outline</h5>
      <ol className="list-decimal list-inside mb-8">
        {sections.map((section) => (
          <li
            key={section.id}
            className="cursor-pointer hover:underline"
            onClick={() => handleClick(section.id)}>
            {section.title}
          </li>
        ))}
      </ol>

      {/* Sections */}
      {sections.map((section) => (
        <section key={section.id} id={section.id}>
          <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
          {section.id === "spark-tldr" && (
            <>
              <p className="mb-4">
                Spark is an off-chain protocol with native Lightning
                interoperability designed to nearly infinitely scale Bitcoin
                transactions. Spark enables instant, free, and unlimited
                self-custodial transactions of Bitcoin while also enabling users
                to send and receive via Lightning. It&apos;s designed as an
                extension of Lightning, addressing some of its key limitations
                while maintaining full compatibility.
              </p>
              <Image
                src="/overview1.png"
                alt="Spark Diagram"
                width={800}
                height={400}
                className="mb-8"
              />
              <p className="mb-4">Spark boasts the following:</p>
              <ul className="list-disc pl-6 mb-8">
                <li className="pl-2">
                  <p>Native BTC</p>
                </li>
                <li className="pl-2">
                  <p>Full self-custody</p>
                </li>
                <li className="pl-2">
                  <p>Instant settlement</p>
                </li>
                <li className="pl-2">
                  <p>Extremely low fees</p>
                </li>
                <li className="pl-2">
                  <p>
                    Native Lightning interface without needing to run a
                    Lightning node
                  </p>
                </li>
                <li className="pl-2">
                  <p>Ability to scale to billions of users</p>
                </li>
                <li className="pl-2">
                  <p>1/n trust assumptions (or minority/n)</p>
                </li>
                <li className="pl-2">
                  <p>Unconditional unilateral exits</p>
                </li>
                <li className="pl-2">
                  <p>
                    Capital efficiency (no pre-funding, large liquidity lockups,
                    etc.)
                  </p>
                </li>
                <li className="pl-2">
                  <p>Offline receive</p>
                </li>
                <li className="pl-2">
                  <p>
                    Exists without the need for a new Bitcoin OPcode or any
                    Bitcoin changes (although improves when they&apos;re
                    available)
                  </p>
                </li>
                <li className="pl-2">
                  <p>
                    Compatible with any Bitcoin token protocol (LRC-20, BRC-20,
                    Runes, Taproot Assets, etc.)
                  </p>
                </li>
                <li className="pl-2">
                  <p>Purpose-built to excel at facilitating payments</p>
                </li>
              </ul>
              <p className="mb-4">What Spark is not:</p>
              <ul className="list-disc pl-6 mb-8">
                <li className="pl-2">
                  <p>100% trustless on day one</p>
                </li>
                <li className="pl-2">
                  <p>A new Bitcoin L2 launching a token</p>
                </li>
              </ul>
            </>
          )}
          {section.id === "why" && (
            <p className="mb-4">
              At Lightspark, we have spent the last two years building on top of
              Bitcoin and the Lightning Network. We&apos;re obsessed with
              payments, and we have a firm conviction that the future of
              payments needs to be on the most open, neutral, and decentralized
              network - and that network is Bitcoin.
              <br />
              <br />
              By definition, Lightning is the best platform for scaling payments
              on top of Bitcoin. For more than two years, we have dedicated
              ourselves to building the best software to scale Lightning by
              massively simplifying its integration. We like to tell potential
              customers, “Don&apos;t worry about all the complexities of running
              your Lightning node — just connect to our APIs, we&apos;ll handle
              it, and you&apos;ll have full control over it.” It&apos;s been an
              incredible journey - partnering with companies like Coinbase and
              Nubank while watching payment volume skyrocket has been nothing
              short of magical. But, realistically speaking, Lightning currently
              works best for onboarding the largest custodians.
              <br />
              <br />
              The more we moved forward, the more we were faced with the
              limitations of Lightning&apos;s current design, particularly when
              it came to the economic feasibility of running nodes for millions
              or billions of individual users.
              <br />
              <br />
              As it stands, Lightning cannot effectively onboard billions of
              users due to the high costs associated with operating a wallet.
              Opening and maintaining channels (parking liquidity, rebalancing,
              etc.) is prohibitively expensive. A small anecdote is that we
              learned this the hard way when we launched our Lightning wallet
              SDK and tried onboarding customers. The user experience was just
              terrible; if you didn&apos;t have at least $1,000 to put into
              Lightning, it was very difficult to justify those costs for the
              sake of performance. To our credit (or not), we tried launching
              this product at the worst possible time, right when the
              BRC-20/Ordinals surge exploded on L1, unpredictably clogging the
              mempool and causing fees to spike. Ultimately, we had no choice
              but to pull the plug on the product.
              <br />
              <br />
              This was a frustrating setback — not from a company perspective
              but from a network effect standpoint. We&apos;re convinced that a
              scaling solution that only serves custodians cannot serve as the
              next financial backbone. To achieve true global reach, you need to
              be able to onboard anyone with an internet connection in the most
              trust-minimized way.
              <br />
              <br />
              This issue isn&apos;t unique to Lightspark at all. Anyone building
              on the Lightning Network quickly faces the same limitations. A lot
              of very talented teams (Breez, Greenlight, Phoenix, etc.) and
              builders are working hard to find ways to mitigate these issues.
              <br />
              <br />
              After countless attempts and thousands of hours spent researching,
              we concluded that scaling self-custody on Lightning had to be
              designed differently.
              <br />
              <br />
              Spark is an attempt to do this.
            </p>
          )}
          {section.id === "how-it-works" && (
            <>
              <h3 className="text-xl font-semibold mb-2">The high-level</h3>
              <p className="mb-4">
                Spark brings together several concepts introduced to the Bitcoin
                community over the past few years and is heavily inspired by
                Statechains. With a lot of empathy, since we&apos;ve gone
                through the same process ourselves, we&apos;ll take the time to
                explain each concept, making it as clear and enjoyable to read
                as possible. This section is still relatively high-level. For
                the technically savvy, we invite you to read our technical
                overview which gets into the weeds of Spark.
                <br />
                <br />
                The general idea of Spark is that it allows assets on Bitcoin to
                be spent off-chain instantly. On Bitcoin, on-chain funds are
                denoted by UTXOs (Unspent transaction outputs, Bitcoin a user
                hasn&apos;t spent yet). In Spark, the user sends funds into
                UTXOs encumbered by a collaborative single signature scheme. The
                participants in this scheme are the user and the Spark Operators
                (SOs). When a user wants to transfer ownership of these funds
                the Spark Operators adjust their keys so the new owner takes
                control, while the overall signature key remains static. The
                beauty of this is that at every moment, the current owner
                remains in full control of their funds and can exit at any time
                without needing permission from the SOs.
                <br />
                <br />
                There are several ways to interact with Spark:
              </p>
              <ol className="list-decimal list-inside mb-4">
                <li>Move funds in and out of Bitcoin</li>
                <li>Transfer within Spark to other users</li>
                <li>
                  Send and receive via Lightning{" "}
                  <b>
                    <small>
                      (without the headaches of operating a Lightning node)
                    </small>
                  </b>
                </li>
                <li>Lightning address & UMA</li>
              </ol>
              <p className="mb-4">
                To fully understand how these transactions work — or to make
                sense of anything we&apos;re writing — it helps to know
                who&apos;s doing what and how everything fits together.
              </p>
              <h3 className="text-xl font-bold mb-2">Key Definitions</h3>
              <ul className="list-disc pl-6 mb-8 space-y-2">
                <li className="pl-2">
                  <p>
                    <b>Spark Entity (SE):</b> A group of entities (individually
                    called SOs) that help facilitate the transfer of UTXO
                    ownership between users on Spark. Their job is simple: they
                    generate, manage, manipulate, and delete their keys. This
                    group can add and remove more operators via consensus to
                    improve trust/performance.
                  </p>
                </li>
                <li className="pl-2">
                  <p>
                    <b>Spark Operator (SO):</b> One of the operators within the
                    SE. They&apos;re mainly responsible for signing transactions
                    and enabling transfers; they collectively make up the SE.
                    Who are these operators? We will be engaging with the most
                    legitimate and neutral companies or organizations in tech,
                    crypto, academia, etc. If you&apos;re interested in
                    potentially becoming one, kindly let us know.
                  </p>
                </li>
                <li className="pl-2">
                  <p>
                    <b>Spark Service Providers (SSPs):</b> SSPs make transfers
                    on Bitcoin and Lightning from Spark cheaper and more
                    efficient. Any entity — whether a wallet provider, exchange,
                    market maker, etc. Some entities will likely be incentivized
                    by charging a small fee for their services. Lightspark is
                    planning to offer these services to serve some of our
                    customers.
                  </p>
                </li>
                <li className="pl-2">
                  <p>
                    <b>Users:</b> Individuals or entities who own and control
                    Bitcoin within Spark. Anyone can be a user; Spark is
                    designed to be as permissionless as possible.
                  </p>
                </li>
                <li className="pl-2">
                  <p>
                    <b>Leaf/Leaves:</b> These are virtual representations of a
                    UTXO within Spark.
                  </p>
                </li>
              </ul>
              <p className="mb-4">
                Now that you&apos;re familiar with the key terms, we can dive
                into Spark and see how everything comes together. As mentioned
                earlier, there are a few ways to get in and out of Spark.
              </p>
              <h3 className="text-xl font-bold mb-2">
                Moving money into, within and from Spark
              </h3>
              <h4 className="text-lg font-bold mb-2">Bitcoin -&gt; Spark</h4>
              <p className="mb-4">
                From your existing wallet, all you have to do is send some BTC
                to a deposit address controlled by the collaborative single
                signature scheme between both you and the SE.
                <br />
                <br />
                Before you transfer the money into Spark— you and the SE will
                sign an exit transaction. This is so that if the SE ever goes
                offline, you can reclaim your funds on L1 to your preferred
                address. Once your deposit is confirmed on-chain, you&apos;re
                all set—congratulations, you now have funds on Spark!
              </p>
              <Image
                src="/bitcoin-spark.png"
                alt="Spark Diagram"
                width={800}
                height={400}
                className="mb-4"
              />
              <h4 className="text-lg font-bold mb-2">Spark &lt;-&gt; Spark</h4>
              <p className="mb-4">
                You can transfer ownership of your Bitcoin to other users within
                Spark by coordinating with the SOs. A transfer is only
                considered valid when the receiver holds a fully signed Bitcoin
                transaction they can use to unilaterally exit.
              </p>
              <h4 className="text-lg font-bold mb-2">Splitting Leaves</h4>
              <p className="mb-4">
                Much like UTXOs (the BTC you haven&apos;t spent yet) on Bitcoin,
                users can split their leaves into smaller denominations for more
                flexible transactions. Via splitting, Spark enables you to send
                smaller portions of leaves as needed. For example, let&apos;s
                say you deposited 1 BTC into Spark. If you wanted to send 0.5
                BTC to a friend, you&apos;d first split the 1 BTC into two
                smaller leaves (0.5 BTC each) and then transfer one away. You
                can even split and transfer atomically for efficiency and
                performance!
              </p>
              <h4 className="text-lg font-bold mb-2">
                Lightning &lt;-&gt; Spark
              </h4>
              <p className="mb-4">
                Users within Spark can always send and receive payments directly
                via the Lightning Network. The best part is that Spark is
                natively compatible with existing Lightning rails. This is
                helpful if Spark users want to off-ramp to an exchange, on-ramp
                to Spark via an exchange, or pay a merchant via Lightning.
                <br />
                <br />
                Importantly, Spark users don&apos;t need to run a node, manage
                Lightning channels, or lock up liquidity themselves. This
                eliminates almost all the overhead associated with traditional
                Lightning operations while providing true offline receipt of
                funds - which isn’t available in typical Lightning.
                <br />
                <br />
                All Lightning payments are powered by SSPs who accept Spark
                leaves to send Lightning payments or accept Lightning payments
                for Spark leaves. This is all done via atomic swaps, so no funds
                are ever at risk of being stolen by the SSP or user. An SSP may
                choose to charge a small fee for this service.
              </p>
              <h4 className="text-lg font-bold mb-2">Spark -&gt; Bitcoin</h4>
              <p className="mb-4">
                We believe that users should be able to exit to Bitcoin L1
                whenever they want, without needing permission from anyone.
              </p>
              <p className="mb-4">There are two ways to exit Spark to L1:</p>
              <h5 className="text-md font-bold mb-2">The Cooperative Exit</h5>
              <p className="mb-4">
                This is the cheapest and fastest way to exit Spark. Similarly to
                Spark Lightning transfers, cooperative exits are done via swaps
                with an on-chain party for funds. On Spark, this is thanks to
                SSPs. SSPs will atomically swap their on-chain funds for Spark
                funds.
              </p>
              <h5 className="text-md font-bold mb-2">The Unilateral Exit</h5>
              <p className="mb-4">
                This is the most pessimistic scenario and can occur at any time.
                Unilateral exits are more expensive than cooperative exits, due
                to the fact that the entire branch needs to be published to
                prove ownership of the most recent state. There doesn&apos;t
                need to be a reason to unilaterally exit, but users could choose
                to if a set of SOs goes offline, or if they&apos;ve lost
                confidence in the SE itself.
              </p>
              <p className="mb-4">
                This solution requires no cooperation, and can be done by any
                user at any time. This is the core to the design of Spark.
              </p>
              <h3 className="text-xl font-bold mb-2">Risks</h3>
              <p className="mb-4">
                As you&apos;ve now probably understood, Spark Operators play a
                big role in Spark. Without them, you wouldn&apos;t be able to
                send or receive money on Spark.
                <br />
                <br />
                The system relies on a minimum of 1 honest operator of the SE
                out of the <InlineMath math="n" /> participants but can be
                configured with a threshold as desired for liveliness. Threshold
                increases the honest operator requirement to the{" "}
                <InlineMath math="((n-threshold)+1)/n" /> operators being honest
                (the minority of signers), but decreases the need for every
                single SO to be online at every point in time. This makes the
                system more trusted, but also more robust from a network
                perspective.
              </p>
            </>
          )}
          {section.id === "spark-ux" && (
            <p className="mb-4">
              Spark is our dream payment solution. We&apos;re building Spark
              with simplicity, security, and performance in mind &mdash; all so
              end-users and developers can have the best experience possible.
            </p>
          )}
          {section.id === "faq" && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is Spark a statechain?</AccordionTrigger>
                <AccordionContent>
                  Spark is based on Statechains and builds on top of them for
                  added functionality. Compared to vanilla statechains, Spark
                  enables threshold signing, enables users to split leaves, and
                  introduces the concept of an SSP.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is Spark live?</AccordionTrigger>
                <AccordionContent>
                  Spark is currently in alpha testing. We are working with
                  partners to test the protocol and will be releasing more
                  information soon.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Is Spark a replacement to Lightning?
                </AccordionTrigger>
                <AccordionContent>
                  Spark is not a replacement to Lightning. It is designed to
                  extend the Lightning Network and address some of its
                  limitations, notably the complexity of running a node and the
                  economic burden of channels for low-tpv users wanting
                  self-custody.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  What fees are involved when using Spark?
                </AccordionTrigger>
                <AccordionContent>
                  Transfers within Spark are free.
                  <br />
                  <br />
                  Fees are incurred when moving in and out of Spark. Fees are
                  charged by SSPs for their services, or in the form of on-chain
                  fees when unilaterally exiting.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>
                  How is this different from a federated sidechain?
                </AccordionTrigger>
                <AccordionContent>
                  Spark allows for unilateral exit where the SE cannot prevent a
                  user from withdrawing their funds. Whereas federated
                  sidechains typically rely upon fully trusting the operators in
                  perpetuity, Spark relies upon a minimized level of trust only
                  at the time of transactions. As long as 1 (or a minority
                  threshold) of Spark operators act honestly at the time of
                  transfer, there is no further trust required while funds are
                  held. Spark also enables an extremely high throughput with
                  parallel processing with instantaneous settlement.
                  Additionally, Spark has a path towards full trustlessness.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>
                  How is this different from Ark?
                </AccordionTrigger>
                <AccordionContent>
                  Spark and Ark both provide scaling on top of Bitcoin, but
                  choose different tradeoffs that impact the user and developer
                  experiences. For in-round payments, Ark can achieve full
                  trustlessness, but for out-of-round payments, the trust model
                  is similar to Spark until it resets upon inclusion in a new
                  round. Multiple rounds can be included as often as each
                  bitcoin block, but due to the nature of publishing each round
                  on-chain, the on-chain footprint can become quite large, which
                  can limit the number of Arks that can be operated. Spark takes
                  the approach of trust minimization in order to remove fees and
                  provide instantaneous settlement and nearly infinite
                  scalability. For Ark to settle, users must be online and
                  interactive for a potentially long period of time.
                  <br />
                  <br />
                  Unilateral exits in Ark and Spark are quite similar. In Ark,
                  if users do not come online and move their funds within a
                  period of time, the user&apos;s funds will revert to the ASP.
                  <br />
                  <br />
                  With Spark, we wanted to build something that would extend
                  Lightning, but make it simpler and more efficient. Lightning
                  support is natively incorporated into Spark, and does not
                  require the end-user to operate a Lightning node, have
                  channels, or be concerned about force-closing channels to
                  protect funds.
                  <br />
                  <br />
                  At scale, Ark requires vast amounts of liquidity by the ASP.
                  If $100M is transferred in a 30-day window, the ASP must front
                  all $100M.
                  <br />
                  <br />
                  Both Spark and Ark would benefit from Bitcoin consensus
                  changes. For Spark, consensus changes can enable full
                  trustlessness. For Ark, consensus changes can remove some of
                  the interactivity and enable potentially more efficient
                  capital usage.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </section>
      ))}
    </div>
  );
};

export default Overview;
