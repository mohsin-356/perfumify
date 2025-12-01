"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface ReviewRowProps {
  review: any;
  showApprove?: boolean;
  showReject?: boolean;
  showDraft?: boolean;
  showDelete?: boolean;
}

export default function ReviewRow({ review, showApprove, showReject, showDraft, showDelete }: ReviewRowProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function mutate(method: string, body?: any) {
    const res = await fetch(`/api/reviews/${review._id}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    return res.ok;
  }

  function act(action: "approve" | "reject" | "draft") {
    startTransition(async () => {
      const ok = await mutate("PUT", { action });
      if (ok) router.refresh();
    });
  }

  function del() {
    startTransition(async () => {
      const ok = await mutate("DELETE");
      if (ok) router.refresh();
    });
  }

  const created = review?.createdAt ? new Date(review.createdAt).toLocaleString() : "";

  return (
    <div className="p-4 bg-white border rounded-lg flex flex-col gap-2">
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <div className="text-sm text-gray-500">{created}</div>
          <div className="font-medium text-gray-900 break-words">
            {review?.name || review?.userName || "Anonymous"}
            {review?.email ? <span className="text-gray-500"> • {review.email}</span> : null}
          </div>
          <div className="text-yellow-600 text-sm">{typeof review?.rating === "number" ? `★`.repeat(review.rating) : null}</div>
          <div className="text-gray-800 text-sm whitespace-pre-wrap break-words">{review?.comment || review?.text}</div>
          <div className="text-xs text-gray-500 mt-1">Status: {review?.status || (review?.approved ? "approved" : "pending")}</div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        {showApprove && (
          <button
            onClick={() => act("approve")}
            disabled={isPending}
            className="px-3 py-1.5 text-xs rounded-md bg-green-600 text-white disabled:opacity-60"
          >
            Approve
          </button>
        )}
        {showReject && (
          <button
            onClick={() => act("reject")}
            disabled={isPending}
            className="px-3 py-1.5 text-xs rounded-md bg-amber-600 text-white disabled:opacity-60"
          >
            Reject
          </button>
        )}
        {showDraft && (
          <button
            onClick={() => act("draft")}
            disabled={isPending}
            className="px-3 py-1.5 text-xs rounded-md bg-gray-700 text-white disabled:opacity-60"
          >
            Draft
          </button>
        )}
        {showDelete && (
          <button
            onClick={del}
            disabled={isPending}
            className="ml-auto px-3 py-1.5 text-xs rounded-md bg-red-600 text-white disabled:opacity-60"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
