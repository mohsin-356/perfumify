"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiSave, FiLoader } from "react-icons/fi";

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, setValue } = useForm();

    useEffect(() => {
        // Fetch settings if API exists, otherwise just show form
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings");
                if (res.ok) {
                    const data = await res.json();
                    setValue("storeName", data.storeName);
                    setValue("currency", data.currency);
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
            }
        };
        fetchSettings();
    }, [setValue]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                alert("Settings saved successfully!");
            } else {
                alert("Failed to save settings.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Store Settings</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
                <div>
                    <label className="block text-sm font-medium mb-2">Store Name</label>
                    <input
                        {...register("storeName")}
                        className="w-full p-2 border rounded-md"
                        placeholder="My Perfume Store"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Currency Symbol</label>
                    <input
                        {...register("currency")}
                        className="w-full p-2 border rounded-md"
                        placeholder="£"
                        defaultValue="£"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
                >
                    {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
                    Save Settings
                </button>
            </form>
        </div>
    );
}
