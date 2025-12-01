import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import { unstable_noStore as noStore } from "next/cache";
import ReviewRow from "@/components/admin/ReviewRow";

async function getData() {
  noStore();
  await connectDB();
  const pending = await Review.find({ approved: false }).sort({ createdAt: -1 }).lean();
  const approved = await Review.find({ approved: true }).sort({ createdAt: -1 }).limit(50).lean();
  return { pending: JSON.parse(JSON.stringify(pending)), approved: JSON.parse(JSON.stringify(approved)) };
}

export default async function ReviewsAdminPage() {
  const { pending, approved } = await getData();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pending Approval</h2>
        {pending.length === 0 && <p className="text-sm text-gray-500">No pending reviews.</p>}
        <div className="space-y-3">
          {pending.map((r: any) => (
            <ReviewRow key={r._id} review={r} showApprove showReject showDraft showDelete />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Recent Approved</h2>
        {approved.length === 0 && <p className="text-sm text-gray-500">No approved reviews yet.</p>}
        <div className="space-y-3">
          {approved.map((r: any) => (
            <ReviewRow key={r._id} review={r} showDraft showReject showDelete />
          ))}
        </div>
      </section>
    </div>
  );
}
