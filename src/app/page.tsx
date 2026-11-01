import Link from "next/link";
import { getItems } from "@/lib/items-server";
import PageClientWrapper from "@/components/PageClientWrapper";
import ClientPageLayout from "@/components/ClientPageLayout";

export default async function Home() {
  const items = await getItems();

  return (
    <PageClientWrapper>
      <ClientPageLayout items={items} />
      <noscript>
        <p className="content-page">
          Search needs JavaScript.{" "}
          <Link href="/tools">Browse the complete text index</Link> to read
          every listing without it.
        </p>
      </noscript>
    </PageClientWrapper>
  );
}
