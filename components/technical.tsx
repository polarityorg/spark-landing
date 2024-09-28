"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InlineMath } from "react-katex";
import Image from "next/image";

const TechnicalOverview = () => {
  const [activeSection, setActiveSection] = useState("");

  const sections = [
    { id: "overview", title: "Overview" },
    { id: "definitions", title: "Definitions" },
    { id: "core-concepts", title: "Core Concepts" },
    { id: "transaction-lifecycles", title: "Transaction Lifecycles" },
    { id: "spark-trust-model", title: "Spark's Trust Model" },
    { id: "limitations-attacks", title: "Limitations / Attacks" },
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
      {/* Outline */}
      <h5 className="font-bold text-sm mb-2">Outline</h5>
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
        <section key={section.id} id={section.id} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
          {section.id === "overview" && (
            <div>
              <p className="mb-4">
                The Lightning Network has enabled nearly instantaneous,
                low-cost, and more scalable payments within Bitcoin. But to do
                so requires each user to, at a minimum, open a single channel
                with an on-chain transaction - or more realistically, have
                multiple channels requiring multiple on-chain transactions.
                While this helps scale transactions, it isn’t economically
                viable for billions of customers or customers sensitive to
                on-chain fees. Further, it’s burdensome both economically and
                technically to source sufficient inbound liquidity for each user
                and to have that liquidity locked to a specific user.
                <br />
                <br />
                Spark is a scalable solution that can onboard billions of users
                overnight, with a low on-chain footprint, no pre-signing or
                availability requirements of users, and minimal trust
                assumptions. From there, we explore how to reach a fully
                trustless variation of Spark in the future. This proposal is a
                logical extension of Statechains, seeking to provide a solution
                that balances what is feasible and practical while staying true
                to the pathways laid out for further scaling Lightning and
                enabling broad adoption.
              </p>
            </div>
          )}
          {section.id === "definitions" && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="statechain">
                <AccordionTrigger>Statechain</AccordionTrigger>
                <AccordionContent>
                  A statechain is a protocol that enables off-chain transfers of
                  ownership for blockchain assets. It allows users to transfer
                  control of a UTXO multiple times without creating on-chain
                  transactions, using cryptographic signatures facilitated by a
                  group of entities. This approach aims to improve transaction
                  speed, privacy, and scalability while maintaining the security
                  of the underlying blockchain.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="atomic-swap">
                <AccordionTrigger>Atomic swap</AccordionTrigger>
                <AccordionContent>
                  Exchanging two secrets A and B for each other such that either
                  both parties involved now both A and B or neither know both A
                  and B.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="leaf">
                <AccordionTrigger>Leaf</AccordionTrigger>
                <AccordionContent>
                  A node or transaction within a tree structure that exists with
                  no children.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="branch">
                <AccordionTrigger>Branch</AccordionTrigger>
                <AccordionContent>
                  A node or transaction within a tree structure that exists with
                  children.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="aggregation">
                <AccordionTrigger>Aggregation</AccordionTrigger>
                <AccordionContent>
                  The process of using child keys to spend the input to one of
                  their ancestors. In the above example, a1+a2 can spend the
                  input to Txn1.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ssp">
                <AccordionTrigger>
                  Spark Service Provider (SSP)
                </AccordionTrigger>
                <AccordionContent>
                  A service provider who puts funds into the Spark Factory -
                  often will also operate as a Lightning Service Provider (LSP)
                  to facilitate Lightning transactions for users within the
                  factory. Any number of SSPs can exist within a single Spark.
                  To be an SSP, an entity adds a UTXO to Spark and performs the
                  operations described later to fan out the UTXO. They also
                  perform atomic swaps for deposits/withdrawals and may choose
                  to re-aggregate leaves to actively manage the UTXOs they
                  entered into the factory. Examples could include entities like
                  Lightspark, Coinbase Wallet, Wallet of Satoshi, Muun, etc.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="se">
                <AccordionTrigger>Spark Entity (SE)</AccordionTrigger>
                <AccordionContent>
                  The group of operators that run Spark. They are responsible
                  for performing the operations necessary for Spark - signing
                  and forgetting past keys. Operators within the SE could
                  simultaneously act as SSP’s or just participate in signing
                  operations to progress the tree.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="so">
                <AccordionTrigger>Spark Operator (SO)</AccordionTrigger>
                <AccordionContent>
                  One of the operators within the SE. A threshold of operators
                  is used to aid in the transference of off-chain UTXOs.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="users">
                <AccordionTrigger>Users</AccordionTrigger>
                <AccordionContent>
                  Users represent non-custodial wallet end-users who want to
                  utilize spark for instant/low-cost bitcoin transfers.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          {section.id === "core-concepts" && (
            <div>
              {/* Statechains */}
              <h3 className="text-xl font-semibold mb-2">Statechains</h3>
              <p className="mb-4">
                This section can be bypassed if the reader understands
                statechains, which are used as a building block for the proposal
                which follows. This section will serve as a way to provide a
                high-level overview of how statechains work - note that the
                description provided here will be imperfect and not completely
                accurate intentionally; rather, this will serve as a way to
                understand the functionality of statechains.
                <br />
                <br /> Statechains are a way to transfer ownership of a UTXO
                off-chain.
                <br />
                <br />
                First, begin with the assumption that adding keys together can
                form a single key. We will start with two parties holding keys -
                one is the user Alice (A) and the other will be called the
                statechain entity (SE) which can be composed of any number of
                members, but will be shown as a single entity below.
                <InlineMath math={`SE+A=Key1`} />
                Each key is represented as a random number. In this example,
                SE’s key is represented by the value 100, and A’s key is
                represented by the value 50.
                <InlineMath math={`100+50=150 =Key1`} />
                Now assume that a signature is simply multiplying the key by the
                hash of some object. The hash will also be represented by a
                number. In this example, our hash will be represented by the
                value 2. Thus, a signature of this hash will be:
                <InlineMath math={`(100+50)*2=300`} />
                We begin with a UTXO encumbered by the spending condition
                requiring the combined signature of SE and A (i.e., signed by
                the 150 combined key). By placing this condition on the UTXO, we
                are putting the UTXO into the statechain. When this occurs,
                Alice and the SE craft and sign a spending transaction, which
                sends the coins directly to Alice after an absolute timelock of
                100 blocks from now.
                <br />
                <br />
                Alice now wishes to transfer ownership of this UTXO to Bob (B),
                but she wants to do so without putting the transaction on-chain.
                Bob’s key is represented by the number 40. He calculates the
                difference between his key and Alice’s key is 10. For him plus
                the SE to sign using the same value as Alice+SE (150), he needs
                the SE to tweak their key by 10. So, the SE discards the old key
                and only keeps a copy of the newly tweaked key 110. Now, the
                SE+Bob still equals 150, so the UTXO can be spent by signing
                using the combined 150. Alice can’t still sign a new transaction
                because the SE forgot the 100 key, so now Alice+SE=160 which
                isn’t a valid key to sign the transaction.
                <br />
                <br />
                Typically, when handing off the key, the new owner will work
                with the SE to sign a new spending transaction with a lower time
                bomb than what Alice had on her signed transactions. Alice and
                SE have a way of conveying to Bob what was signed previously,
                and then Bob will craft a new transaction with an absolute time
                lock of 90 (less than the lock Alice has a signed transaction
                for). Each time it’s passed to a new person, they decrease the
                time lock. If anyone tried to claim the UTXO, they could only do
                so once their time bomb arrived.
                <br />
                <br />
                It should be noted that this limits the time that a UTXO can
                exist within a statechain - the current owner of the UTXO needs
                to claim the funds on-chain once the timebomb expires or else
                the prior owner will have the opportunity to claim the UTXO
                on-chain.
                <br />
                <br />
                The SE is generally n entities. As long as one of the entities
                actually discards the old key, then the transfer is safe. The
                safety guarantee holds true as long as a single one of the n
                entities is honest. If that is the case, then no old owner can
                claim the UTXO prior to the latest owner and no prior owner can
                acquire a newly signed transaction after passing off ownership -
                because the honest entities within the SE have forgotten the old
                untweaked key and thereby couldn’t sign with it even if coerced.
              </p>
              <h3 className="text-xl font-semibold mb-2">Timelocks</h3>
              <p className="mb-4">
                The diagram below shows how statechains typically work:
                <Image
                  src="/timelock1.png"
                  alt="Timelock Diagram"
                  width={800}
                  height={400}
                  className="mb-8"
                />
              </p>
              <p className="mb-4">
                In the above diagram, transactions 2 through 4 are all held
                off-chain. They all spend the same output from Txn0 and are
                replacements for each other. They use decreasing timelocks such
                that Txn4 can be put on-chain prior to Txn3, which could be put
                on-chain prior to Txn2. In this way, when ownership of the key
                controlling the funds is transferred to a new user, they can
                check the prior transactions and be assured that they can
                publish their new transaction first. These timelocks create a
                timebomb where the off-chain transaction with the lowest
                timelock will need to be put on-chain when its timelock expires,
                otherwise there is a risk that other transactions can claim the
                funds.
              </p>
              <p className="mb-4">
                This can, however, be eliminated by the following flow:
                <Image
                  src="/timelock2.png"
                  alt="Timelock Second Diagram"
                  width={800}
                  height={400}
                  className="mb-8"
                />
              </p>
              <p className="mb-4">
                Txn1 spends the output of Txn0. Txn1 has no timelock. When users
                transfer keys, they transfer ownership of the key that encumbers
                the output of Txn1. The transactions that spend from Txn1’s
                output look like the normal statechain transactions that include
                decreasing timelocks relative to their parent transaction. But
                because Txn1 is held off-chain, there is no absolute timebomb.
              </p>
              <p className="mb-4">
                The obvious problem with this is that if someone double-spends
                the output consumed by Txn1, then all of the leaves (Txn2..4)
                become invalid. To avoid this, the “SE” key is deleted by the SE
                - resulting in only one transaction ever generated for Txn0’s
                output. The exact mechanics of this will be discussed later.
              </p>
              {/* Tree */}
              <h3 className="text-xl font-semibold mb-2">Tree</h3>
              <p className="mb-4">
                A Spark tree is made up of both Leaf-Transactions as well as
                Branch-Transactions.
              </p>
              <Image
                src="/tree.png"
                alt="Tree Diagram"
                width={800}
                height={400}
                className="mb-8"
              />
              <p className="mb-4">
                <strong>Definition: Branch transaction (BT)</strong> - All
                transactions of the tree that are not leaf transactions. In the
                above diagram, these are Txn1..7. These are nearly identical to
                leaf transactions, except they do not have timelocks and can
                only be spent by the sum of the keys of the leaves under them.
              </p>
              <p className="mb-4">
                <strong>Definition: Leaf transaction (LT)</strong> - Terminal
                transactions of the tree that are owned by an individual user.
                In the above diagram, Txn8..11 are leaf transactions.
              </p>
              <p className="mb-4">
                We extend a UTXO within Spark into branches and leaves. Txn0 is
                spent by Txn1, which is held off-chain. Txn1 is the first BT. As
                mentioned above, the absolute timelock timebombs are removed
                from the tree.
              </p>
              <p className="mb-4">
                At each branching, the keys to spend the parent input are split
                as described in Branching spending conditions by splitting keys.
                This means that Txn1 could be replaced by a transaction signed
                by the aggregation of:
              </p>
              <ul className="list-disc ml-8 space-y-2">
                <li>
                  <InlineMath math="(B_{0.1.1.1.1} + SE_{0.1.1.1.1}) + (B_{0.1.2.1.1} + SE_{0.1.2.1.1}) + (B_{0.2.1.1.1} + SE_{0.2.1.1.1}) + (B_{0.2.2.1.1} + SE_{0.2.2.1.1})" />
                </li>
                <li>
                  Which also equals: <InlineMath math="B_0 + SE_0" />
                </li>
                <li>
                  Which also equals:{" "}
                  <InlineMath math="B_{0.1} + SE_{0.1} + B_{0.2} + SE_{0.2}" />
                </li>
                <li>
                  Which also equals:
                  <InlineMath math="B_{0.1.1} + SE_{0.1.1} + B_{0.1.2} + SE_{0.1.2} + B_{0.2.1} + SE_{0.2.1} + B_{0.2.2} + SE_{0.2.2}" />
                </li>
                <li>
                  Which also equals:
                  <InlineMath math="(B_{0.1.1.1} + SE_{0.1.1.1}) + (B_{0.1.2.1} + SE_{0.1.2.1}) + (B_{0.2.1.1} + SE_{0.2.1.1}) + (B_{0.2.2.1} + SE_{0.2.2.1})" />
                </li>
              </ul>
              {/* SSP */}
              <h3 className="text-xl font-semibold mt-4 mb-2">
                SSP - Spark Service Provider
              </h3>
              <p className="mb-4">
                A Spark service provider is an entity that is willing to swap
                funds in and out Spark for funds on Lightning or L1. They may
                choose to charge a small fee for this service, and ultimately
                improve the overall capital efficiency of the system by making
                it cheaper and faster to on and offboard.
              </p>
            </div>
          )}
          {section.id === "transaction-lifecycles" && (
            <div>
              {/* Deposit */}
              <h3 className="text-xl font-semibold mb-2">Deposits from L1</h3>
              <p className="mb-4">
                This section outlines the step-by-step process for depositing
                funds from the Bitcoin L1 into Spark.
              </p>
              <h4 className="text-lg font-semibold mb-2">Pre-conditions</h4>
              <ul className="list-disc ml-8">
                <li>User has a Bitcoin wallet with some sats</li>
              </ul>
              <h4 className="text-lg font-semibold mt-2 mb-2">
                Steps-by-Step Process
              </h4>
              <div className="ml-4">
                <h5 className="text-md font-semibold mb-2">
                  Step 1 - Address Generation
                </h5>
                <ol className="list-decimal list-inside pl-8">
                  <li>
                    <strong>Key Generation:</strong>
                    <ol className="list-disc ml-8 space-y-2">
                      <li>
                        The user and SE work together to generate an aggregate
                        public key, which is the sum of all the individual SE
                        public keys and the user's public key. They then derive
                        a pay-to-taproot address for this key.
                      </li>
                      <li>
                        <InlineMath
                          math={`PubKey_{Combined} = PubKey_{User} + PubKey_{SO_1} + PubKey_{SO_2} ...`}
                        />
                      </li>
                    </ol>
                  </li>
                </ol>
                <h5 className="text-md font-semibold mb-2">
                  Step 2 - Transaction Creation
                </h5>
                <ol className="list-decimal list-inside pl-8">
                  <li>
                    <strong>Setup and Signing:</strong>
                    <ul className="list-disc ml-8">
                      <li>
                        User and SE collaboratively create and sign two
                        transactions:
                        <ol className="list-decimal ml-8">
                          <li>
                            An intermediate transaction (not broadcasted) with
                            no timelock that spends from the combined public key
                            back to the combined public key. This transaction
                            triggers the relative timelock of leaves under it.
                          </li>
                          <li>
                            A refund transaction with a timelock relative to the
                            intermediate transaction. This transaction is
                            broadcasted if the user wants to exit Spark.
                          </li>
                        </ol>
                      </li>
                      <li>
                        <strong>
                          Both transactions are signed by all parties involved
                          in order to recreate the combined key spending
                          condition.
                        </strong>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Storage:</strong>
                    <ul className="list-disc ml-8">
                      <li>
                        User and SE securely store the signed transactions
                      </li>
                    </ul>
                  </li>
                </ol>
                <h5 className="text-md font-semibold mb-2">
                  Step 3 - Deposit and Confirmation
                </h5>
                <ol className="list-decimal list-inside pl-8">
                  <li>
                    <strong>User Deposit:</strong>
                    <ul className="list-disc ml-8">
                      <li>
                        User broadcasts a deposit transaction to the
                        Pay-to-Taproot address from Step 1
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>SE Confirmation:</strong>
                    <ul className="list-disc ml-8">
                      <li>
                        SE verifies the deposit and issues a Spark leaf to the
                        user
                      </li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>
          )}
          {section.id === "spark-trust-model" && (
            <div>
              <p className="mb-4">
                In designing Spark, the primary goal was to maintain strong
                security guarantees for users while maintaining performance. We
                achieve this by closely mirroring the trust model of the
                Lightning Network, ensuring that users have the exact same L1
                guarantees.
              </p>
              {/* Add more content for Spark's Trust Model */}
            </div>
          )}
          {section.id === "limitations-attacks" && (
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Prior owner publishes branch
              </h3>
              <p className="mb-4">
                The first attack is for an old owner of the UTXO to publish the
                branch. When this happens, there is a time limitation during
                which the correct owner needs to publish the leaf transaction.
              </p>
              {/* Add more content for Limitations / Attacks */}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default TechnicalOverview;
