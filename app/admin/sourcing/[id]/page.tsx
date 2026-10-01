import { notFound } from "next/navigation";
import SourcingRequestView from "@/components/admin/SourcingRequestView";
import { getSourcingRequest } from "@/lib/data";

export default async function SourcingRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = getSourcingRequest(id);
  if (!request) notFound();
  return <SourcingRequestView request={request} />;
}