"use client";

import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

interface DeleteConfirmProps {
    productName: string;
    productId: string;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteConfirmDialog({
    productName,
    onClose,
    onConfirm,
}: DeleteConfirmProps) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        onConfirm();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                        <FiTrash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
                        <p className="text-sm text-gray-500">This action cannot be undone</p>
                    </div>
                </div>

                <p className="text-gray-700 mb-6">
                    Are you sure you want to delete <strong className="text-gray-900">"{productName}"</strong>?
                    The product will be permanently removed from your store.
                </p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={deleting}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {deleting ? "Deleting..." : "Delete Product"}
                    </button>
                </div>
            </div>
        </div>
    );
}
