"use client";

import { useState } from "react";
import Image from "next/image";

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
      <h1 className="text-4xl font-bold mb-6">Spark Overview</h1>
      <p className="mb-4">
        A trust-minimized solution designed to scale Bitcoin and extend the
        Lightning Network.
      </p>

      {/* disclaimer */}
      <h5 className="font-bold text-sm">Disclaimer</h5>
      <p className="mb-4">
        Typically, when a new protocol is introduced to the community, less than
        1% of people end up reading it given how overwhelming the material can
        be. We&#39;ve tried something different; this version is an attempt to
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
                Heavily inspired by statechains, Spark is an off-chain protocol
                designed to scale Bitcoin transactions with native Lightning
                interoperability. In other words, Spark allows for instant,
                free, and unlimited self-custodial transactions of Bitcoin while
                also enabling users to send and receive via Lightning. It&#39;s
                designed specifically as an extension of Lightning, addressing
                some of its key limitations.
              </p>
              <Image
                src="/overview1.png"
                alt="Spark Diagram"
                width={800}
                height={400}
                className="mb-8"
              />
              <p className="mb-4">
                At its core, Spark has the following features:
              </p>
              <ul className="list-disc list-inside mb-8">
                <li>Uses native Bitcoin</li>
                <li>Millisecond settlement</li>
                <li>Extremely cheap</li>
                <li>Sends and receives to native Lightning</li>
                <li>Scalable to billions of users</li>
                <li>Trust-minimized (1/n or minority/n)</li>
                <li>Unconditional unilateral exits</li>
                <li>Capital efficient (no pre-funding etc.)</li>
                <li>Optionality to support private payments</li>
                <li>Self-custodial</li>
                <li>
                  Doesn&#39;t need a new Bitcoin OPcode or any Bitcoin changes
                </li>
                <li>Offline receive</li>
                <li>
                  Compatible with any Bitcoin token protocol (LRC-20, BRC-20,
                  Runes, Taproot Assets etc.)
                </li>
              </ul>
              <p className="mb-4">What Spark is not:</p>
              <ul className="list-disc list-inside mb-8">
                <li>100% trustless on day one</li>
                <li>A new Bitcoin L2 launching a token</li>
                <li>A new fancy EVM / smart-contract bitcoin platform</li>
              </ul>
            </>
          )}
          {section.id === "why" && (
            <>
              <p className="mb-4">
                At Lightspark, we have spent the last two years building on top
                of Bitcoin and the Lightning Network. We&#39;re obsessed with
                payments, and we believe Bitcoin is the only neutral network
                capable of moving value online without reliance on specific
                companies or individuals.
              </p>
              <p className="mb-4">
                By definition, Lightning is the best platform for scaling
                payments on top of Bitcoin. For more than two years, we
                dedicated ourselves to building the best software to scale
                Lightning by massively simplifying its integration. We like to
                tell potential customers, &#39;Don&#39;t worry too much about
                all the complexities of running your node — just connect to our
                APIs, we&#39;ll handle it and you&#39;ll have full control over
                it.&#39; It&#39;s been an incredible journey, and partnering
                with companies like Coinbase and Nubank while watching payment
                volume grow has been nothing short of magical. Realistically
                speaking, Lightning has been for onboarding the largest
                custodians.
              </p>
              <p className="mb-4">
                However, the more we were moving forward, the more we were faced
                with the limitations of Lightning&#39;s current design,
                particularly when it came to scaling the number of nodes on the
                network.
              </p>
              <p className="mb-4">
                As it stands, Lightning cannot effectively onboard billions of
                users due to the high costs associated with operating a wallet.
                Opening and maintaining channels (parking liquidity,
                rebalancing, etc.) is prohibitively expensive. A small anecdote
                is that we learned this the hard way when we launched our
                Lightning wallet SDK and tried onboarding customers. The user
                experience was just terrible; if you didn&#39;t have at least
                $1,000 to put into Lightning, it was very difficult to justify
                those costs for the sake of performance. To our credit (or not),
                we tried launching this product at the worst possible time,
                right when the BRC-20/Ordinals surge exploded on L1,
                unpredictably clogging the mempool. Ultimately, we had no choice
                but to pull the plug on the product.
              </p>
              <p className="mb-4">
                This was a frustrating setback — not from a company perspective
                but from a network effect standpoint. We&#39;re convinced that a
                scaling solution that only serves custodians will never succeed.
                To achieve true global reach, you need to be able to onboard
                anyone with an internet connection in the most trust-minimized
                way.
              </p>
              <p className="mb-4">
                This issue isn&#39;t unique to Lightspark at all. Anyone
                building on the Lightning Network quickly faces the same
                limitations. A lot of very talented companies (Breez,
                Greenlight, Phoenix, etc.) and builders are working hard to find
                ways to mitigate these issues.
              </p>
              <p className="mb-4">
                After countless attempts and thousands of hours spent
                researching, we concluded that scaling self-custody on Lightning
                had to be designed differently.
              </p>
              <p className="mb-4">Spark is an attempt to do this.</p>
            </>
          )}
          {section.id === "how-it-works" && (
            <>
              <h3 className="text-xl font-semibold mb-2">The high-level</h3>
              <p className="mb-4">
                Spark brings together several concepts introduced to the Bitcoin
                community over the past few years. With a lot of empathy, since
                we&#39;ve gone through the same process ourselves, we&#39;ll
                take the time to explain each concept, making it as clear and
                enjoyable to read as possible. This section is still relatively
                high-level. For the most impatient, you can skip it directly
                here if you want to really geek out on Spark.
              </p>
              <p className="mb-4">
                The general idea of Spark is that it allows on-chain funds to be
                spent off-chain instantly. In Bitcoin, on-chain funds are
                denoted by UTXOs (Bitcoin a user hasn&#39;t spent yet). In
                Spark, the user sends UTXO&#39;s to a multisig between the user
                and the Spark operators (SOs). When a user wants to transfer
                ownership of these funds the Spark operators coordinate and
                adjust their keys so the new owner takes control. The beauty of
                this is that at every moment the user remains in full control of
                their funds and can exit at any time without needing permission
                from the SOs.
              </p>
              <p className="mb-4">
                There are several ways to interact with the Spark: users can
                move funds in and out from Bitcoin, transfer within the Spark to
                other users, and send and receive via Lightning. To fully
                understand how these transactions work — or to make sense of
                anything we&#39;re writing; it helps to know who&#39;s doing
                what and how everything fits together.
              </p>
              <h3 className="text-xl font-bold mb-2">Key Definitions</h3>
              <ul className="list-disc list-inside mb-8">
                <li>
                  <b>Spark Entity (SE):</b> A group of entities (individually
                  called SOs) that help facilitate the transfer of UTXO
                  ownership between users on Spark. Their job is simple: they
                  sign and delete their old keys. This group can add and remove
                  individuals at will.
                </li>
                <li>
                  <b>Spark Service Providers (SSPs):</b> SSPs facilitate
                  transfers between Bitcoin and Lightning. Any entity — whether
                  a wallet provider, crypto exchange, or market maker etc. can
                  become an SSP, as long as they provide the needed liquidity
                  for users to move in and out of Spark via Bitcoin or
                  Lightning. If you don&#39;t want to trust a provider, you can
                  also be your own SSP. Some entities will likely be
                  incentivized by charging a small fee for their services.
                  Lightspark is planning to offer these services to serve some
                  of our customers.
                </li>
                <li>
                  <b>Spark Operator (SO):</b> One of the operators within the
                  SE. To sign transactions and enable transfers, they need to
                  collectively meet a specific threshold set by Spark (undefined
                  for now). Who are these operators? To be honest, we don&#39;t
                  know yet. For security reasons, it&#39;s unlikely to be open
                  to just anyone, but we aim to keep it as open as possible. We
                  are thinking about the most legitimate and neutral companies
                  or organizations in tech, crypto, academia, etc. If you&#39;re
                  interested in potentially becoming one, let us know
                </li>
                <li>
                  <b>Users:</b> Individuals or entities who own and control
                  Bitcoin within Spark. Anyone will be able to be a user, Spark
                  is designed to be as permissionless as possible.
                </li>
                <li>
                  <b>Leaf/Leaves:</b> These are virtual representations of a
                  UTXO within Spark.
                </li>
              </ul>
              <p className="mb-4">
                Now that you&#39;re familiar with the key terms, we can dive
                into Spark and see how everything comes together. As mentioned
                earlier, there are a few ways to get in and out of Spark.
              </p>
              <h3 className="text-xl font-bold mb-2">
                Moving money into, within and from Spark
              </h3>
              <p className="mb-4">
                Let&#39;s say your generous friends gave you ten BTC for your
                birthday last year. It&#39;s been sleeping in your wallet since.
                You keep hearing about the Lightning network and want to play
                with it. You decide to use Spark to keep self-custody but
                you&#39;re unsure where to start.
              </p>
              <h4 className="text-lg font-bold mb-2">Bitcoin -&gt; Spark</h4>
              <p className="mb-4">
                From your existing wallet, all you have to do is send the amount
                of BTC you want in Spark to a deposit address (a multisig)
                controlled by both you and the SOs.
              </p>
              <p className="mb-4">
                Before you transfer the money into multisig — you and the SE
                will sign an exit transaction, so if the SOs ever go offline or
                act maliciously, you can always reclaim your funds on Bitcoin to
                your preferred address. Once your transfer to the deposit
                address is confirmed on-chain you will have funds on Spark.
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
                transaction they can use to unilaterally exit. It&#39;s
                impossible for the SOs to move the money without your signed
                permission.
              </p>
              <h4 className="text-lg font-bold mb-2">Splitting Leaves</h4>
              <p className="mb-4">
                Much like UTXOs (the BTC you haven&#39;t spent yet) on Bitcoin,
                users can split their leaves into smaller units for more
                flexible transactions. By enabling this Spark allows you to send
                smaller portions of leaves as needed. For example, let&#39;s say
                you deposited all the 10 BTC into Spark. If you wanted to send 5
                BTC on Spark, you&#39;d first split the 10 BTC into two smaller
                leaves (5 BTC each), and then transfer one away. You can split
                and transfer at the same time for efficiency and performance.
              </p>
              <h4 className="text-lg font-bold mb-2">
                Lightning &lt;-&gt; Spark
              </h4>
              <p className="mb-4">
                Once you have funds on Spark, you can send and receive payments
                directly via any Lightning Network endpoint (without any change
                on their end!). This is helpful if Spark users want to off-ramp
                to an exchange, on-ramp to Spark via an exchange, or pay a
                merchant via Lightning.
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>
                  <b>To send a Lightning payment:</b>
                  <ul className="list-disc list-inside ml-4">
                    <li>
                      Users can send payments to Lightning Network users by
                      atomically swapping leaves on Spark for payment on
                      Lightning through SSPs.
                    </li>
                  </ul>
                </li>
                <li>
                  <b>To receive a Lightning payment:</b>
                  <ul className="list-disc list-inside ml-4">
                    <li>
                      Users can receive Lightning payments into their Spark
                      balance by swapping a payment preimage (a secret used to
                      unlock a Lightning payment) for some of the SSPs&#39;
                      leaves.
                    </li>
                  </ul>
                </li>
              </ul>
              <h4 className="text-lg font-bold mb-2">Spark -&gt; Bitcoin</h4>
              <p className="mb-4">
                We believe that users should be able to exit to Bitcoin L1
                whenever they want, without needing permission from anyone.
              </p>
              <h5 className="text-md font-bold mb-2">The Cooperative Exit</h5>
              <p className="mb-4">
                This is in the most optimistic scenario where everyone is acting
                honest for your behalf. In full transparency, we expect this to
                be the most used method to exit Spark cheaply and quickly.
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>
                  Users can withdraw their Bitcoin back to the L1 by atomically
                  swapping leaves on Spark for UTXO&#39;s on L1 with an SSP.
                </li>
              </ul>
              <h5 className="text-md font-bold mb-2">Unilateral Exit</h5>
              <p className="mb-4">
                This is the most pessimistic scenario where a set of SOs could
                be unresponsive or trying to act maliciously. This solution is
                more expensive.
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>
                  Users can unilaterally broadcast their latest state to the
                  Bitcoin network without cooperation. Every leaf comes with a
                  signed Bitcoin transaction that can be broadcasted to L1 at
                  will.
                </li>
              </ul>
              <h3 className="text-xl font-bold mb-2">Trust Assumptions</h3>
              <p className="mb-4">
                As you have now understood, Spark operators play a big role in
                the functioning Spark. Without them, you can&#39;t send or
                receive money on Spark.
              </p>
              <p className="mb-4">
                The system relies upon a minimum of 1 honest operator of the SE
                out of the n participants but can be configured with a threshold
                as desired for liveliness. Threshold increases the honest
                operator requirement to the n-threshold/n operators being honest
                (the minority of signers).
              </p>
            </>
          )}
          {/* Add content for other sections (spark-ux and faq) here */}
        </section>
      ))}
    </div>
  );
};

export default Overview;
