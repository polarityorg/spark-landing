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
      {/* disclaimer */}
      <h5 className="font-bold text-sm">Disclaimer</h5>
      <p className="mb-4">
        Typically, when a new protocol is introduced to the community, less than
        1% of people end up reading it given how overwhelming the material can
        be. We&apos;ve tried something different; this version is an attempt to
        speak to multiple audiences.
      </p>
      <p className="mb-4">
        Please keep us honest — any and all feedback is welcome.
      </p>

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
                Spark is an off-chain protocol designed to scale Bitcoin
                transactions with native Lightning interoperability. In other
                words, Spark enables instant, free, and unlimited self-custodial
                transactions of Bitcoin while also enabling users to send and
                receive via Lightning. It&apos;s designed as an extension of
                Lightning, addressing some of its key limitations.
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
                  <p>Native Lightning interface</p>
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
                    Capital efficiency (no pre-funding, large liquidity lockups
                    etc.)
                  </p>
                </li>
                <li className="pl-2">
                  <p>Private payments support</p>
                </li>
                <li className="pl-2">
                  <p>Offline receive</p>
                </li>
                <li className="pl-2">
                  <p>
                    Exists without the need a new Bitcoin OPcode or any Bitcoin
                    changes (although improves when they&apos;re available)
                  </p>
                </li>
                <li className="pl-2">
                  <p>
                    Compatible with any Bitcoin token protocol (LRC-20, BRC-20,
                    Runes, Taproot Assets etc.)
                  </p>
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
                <li className="pl-2">
                  <p>A new fancy EVM / smart-contract Bitcoin L2</p>
                </li>
              </ul>
            </>
          )}
          {section.id === "why" && (
            <p className="mb-4">
              At Lightspark, we have spent the last two years building on top of
              Bitcoin and the Lightning Network. We&apos;re obsessed with
              payments, and we believe Bitcoin is the only neutral network
              capable of moving value online without reliance on specific
              companies or individuals.
              <br />
              <br />
              By definition, Lightning is the best platform for scaling payments
              on top of Bitcoin. For more than two years, we dedicated ourselves
              to building the best software to scale Lightning by massively
              simplifying its integration. We like to tell potential customers,
              &apos;Don&apos;t worry too much about all the complexities of
              running your node — just connect to our APIs, we&apos;ll handle it
              and you&apos;ll have full control over it.&apos; It&apos;s been an
              incredible journey, and partnering with companies like Coinbase
              and Nubank while watching payment volume grow has been nothing
              short of magical. Realistically speaking, Lightning has been for
              onboarding the largest custodians.
              <br />
              <br />
              However, the more we were moving forward, the more we were faced
              with the limitations of Lightning&apos;s current design,
              particularly when it came to scaling the number of nodes on the
              network.
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
              mempool. Ultimately, we had no choice but to pull the plug on the
              product.
              <br />
              <br />
              This was a frustrating setback — not from a company perspective
              but from a network effect standpoint. We&apos;re convinced that a
              scaling solution that only serves custodians will never succeed.
              To achieve true global reach, you need to be able to onboard
              anyone with an internet connection in the most trust-minimized
              way.
              <br />
              <br />
              This issue isn&apos;t unique to Lightspark at all. Anyone building
              on the Lightning Network quickly faces the same limitations. A lot
              of very talented companies (Breez, Greenlight, Phoenix, etc.) and
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
                community over the past few years, it is heavily inspired by
                Statechains. With a lot of empathy, since we&apos;ve gone
                through the same process ourselves, we&apos;ll take the time to
                explain each concept, making it as clear and enjoyable to read
                as possible. This section is still relatively high-level. For
                the technically savvy, we invite you to read our technical
                overview which gets into the weeds of Spark.
                <br />
                <br />
                The general idea of Spark is that it allows BTC to be spent
                off-chain instantly. On Bitcoin, on-chain funds are denoted by
                UTXOs (Unspent transaction outputs, Bitcoin a user hasn&apos;t
                spent yet). In Spark, the user sends UTXO&apos;s to a multisig
                between the user and the Spark Operators (SOs). When a user
                wants to transfer ownership of these funds the Spark Operators
                coordinate and adjust their keys so the new owner takes control.
                The beauty of this is that at every moment the current owner
                remains in full control of their funds and can exit at any time
                without needing permission from the SOs.
                <br />
                <br />
                There are several ways to interact with Spark:
              </p>
              <ol className="list-decimal list-inside mb-4">
                <li>Move funds in and out from Bitcoin</li>
                <li>Transfer within Spark to other users</li>
                <li>Send and receive via Lightning</li>
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
                    <b>Spark Operator (SO):</b> One of the operators within the
                    SE. They&apos;re mainly responsible for signing transactions
                    and enabling transfers, they collectively make up the SE.
                    Who are these operators? To be honest, we don&apos;t know
                    yet. We are thinking about the most legitimate and neutral
                    companies or organizations in tech, crypto, academia, etc.
                    If you&apos;re interested in potentially becoming one,
                    kindly let us know.
                  </p>
                </li>
                <li className="pl-2">
                  <p>
                    <b>Spark Entity (SE):</b> A group of entities (individually
                    called SOs) that help facilitate the transfer of UTXO
                    ownership between users on Spark. Their job is simple: they
                    generate, manage, manipulate, and delete their keys. This
                    group can add and remove more operators via consensus to
                    improve or degrade trust/performance.
                  </p>
                </li>
                <li className="pl-2">
                  <p>
                    <b>Spark Service Providers (SSPs):</b> SSPs make transfers
                    on Bitcoin and Lightning from Spark cheaper and more
                    efficient. Any entity — whether a wallet provider, exchange,
                    or market maker etc. can become an SSP. If you don&apos;t
                    want to trust a provider, you can also be your own SSP. Some
                    entities will likely be incentivized by charging a small fee
                    for their services. Lightspark is planning to offer these
                    services to serve some of our customers.
                  </p>
                </li>
                <li className="pl-2">
                  <p>
                    <b>Users:</b> Individuals or entities who own and control
                    Bitcoin within Spark. Anyone can be a user, Spark is
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
                to a deposit address (a multisig) controlled by both you and the
                SE.
                <br />
                <br />
                Before you transfer the money into multisig — you and the SE
                will sign an exit transaction, so that if the SE ever go offline
                or act maliciously, you can always reclaim your funds on Bitcoin
                to your preferred address. Once your deposit is confirmed
                on-chain, you're all set—congratulations you now have funds on
                Spark!
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
                smaller leaves (0.5 BTC each), and then transfer one away. You
                can even split and transfer atomically for efficiency and
                performance!
              </p>
              <h4 className="text-lg font-bold mb-2">
                Lightning &lt;-&gt; Spark
              </h4>
              <p className="mb-4">
                Users within Spark can always send and receive payments directly
                via the Lightning Network. The best part is, Spark is natively
                compatible with existing Lightning rails. This is helpful if
                Spark users want to off-ramp to an exchange, on-ramp to Spark
                via an exchange, or pay a merchant via Lightning.
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
                whenever they want; without needing permission from anyone.
                <br />
                <br />
                There are two ways to exit Spark to L1:
              </p>
              <h5 className="text-md font-bold mb-2">The Cooperative Exit</h5>
              <p className="mb-4">
                This is the cheapest and fastest way to exit Spark. Similarly to
                Lightning, cooperative exits are done via swaps with an on-chain
                party for funds. On Spark, this is thanks to SSPs. SSPs will
                atomically swap their on-chain funds for Spark funds.
              </p>
              <h5 className="text-md font-bold mb-2">The Unilateral Exit</h5>
              <p className="mb-4">
                This is the most pessimistic scenario and can occur at any time.
                Unilateral exits are more expensive than cooperative exits, due
                to the fact that past states need to be published all the way up
                to the most recent state. There doesn&apos;t need to be a reason
                to unilaterally exit, but users could choose to if a set of
                SO&apos;s goes offline, if an SO set is attempting to be
                malicious, or if they&apos;ve lost confidence in the SE itself.
                <br />
                <br />
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
                <InlineMath math="(n-threshold)/n" />
                operators being honest (the minority of signers), but decreases
                the need for every single SO to be online at every point in
                time. This makes the system more trusted, but also more robust
                from a network perspective.
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
                  Spark is based off of Statechains and builds on top of them
                  for added functionality. Compared to vanilla statechains,
                  Spark enables threshold signing, enables users to split
                  leaves, and introduces the concept of an SSP.
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
                  user from withdrawing their funds. Spark also enables a very
                  high throughput and parallel processing with instantaneous
                  settlement. Additionally, Spark has a path towards full
                  trustlessness.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>
                  How is this different from Ark?
                </AccordionTrigger>
                <AccordionContent>
                  Ark is fully trustless, but has a very heavy on-chain
                  footprint. Ark also requires the ASP to front all money -
                  meaning that if $100M is transferred in a 30 day window, the
                  ASP must front all $100M. Ark also requires Bitcoin consensus
                  changes to operate efficiently. At the start of rounds, users
                  must be online to coordinate signatures in Ark. This can be a
                  longer process in the case of malicious entities. Users in an
                  Ark must come online prior to the 4 week expiration period or
                  they lose their funds.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger>
                  How is this different from a rollup?
                </AccordionTrigger>
                <AccordionContent>
                  The trust assumptions of currently proposed rollups are
                  arguably worse than Spark. In theory, 1-of-n operators must be
                  honest, but in practice, that isn&apos;t necessarily true. If
                  an operator doesn&apos;t have sufficient liquidity to front
                  withdrawals, the next operator assumes control. This continues
                  until it eventually becomes a single owner with full control
                  of the funds. This means that even if there are many honest
                  operators, a single malicious operator may be able to steal
                  all funds.
                  <br />
                  <br />
                  Unilateral exit isn&apos;t always possible - another operator
                  must challenge that the current lead operator isn&apos;t
                  including a transaction. Which may take weeks or even months
                  for you to be able to withdraw and requires the challenge from
                  an operator.
                  <br />
                  <br />
                  Additionally, the on-chain footprint is very large.
                  Particularly when L1 is used as the data availability layer.
                  <br />
                  <br />
                  The liquidity costs are very high for rollups as well - the
                  operator must have enough liquidity to cover withdrawals for
                  ~6 months. Settlement is also unlikely to be instant.
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
