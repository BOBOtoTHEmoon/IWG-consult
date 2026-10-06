import { notFound } from "next/navigation";
import SourcingRequestView from "@/components/admin/SourcingRequestView";
import { getSourcingRequestByNumber } from "@/lib/sourcing";

export const dynamic = "force-dynamic";

// The URL uses the request number, e.g. /admin/sourcing/SR-1001
export default async function SourcingRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await getSourcingRequestByNumber(decodeURIComponent(id));
  if (!request) notFound();
  return <SourcingRequestView request={request} />;
}