import Input from "@components/ui/input";
import Button from "@components/ui/button";
import { useForm } from "react-hook-form";
import TextArea from "@components/ui/text-area";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import http from "@framework/utils/http";

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
  remember?: boolean;
}

const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<null | { ok: boolean; error?: string }>(null);
  async function onSubmit(values: ContactFormValues) {
    setSubmitting(true);
    setSubmitted(null);
    try {
      await http.post("/leads", {
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.message,
      });
      setSubmitted({ ok: true });
    } catch (e: any) {
      const err = e?.response?.data?.error || e?.message || "Failed to submit";
      setSubmitted({ ok: false, error: String(err) });
    } finally {
      setSubmitting(false);
    }
  }
  const { t } = useTranslation();
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mx-auto flex flex-col justify-center "
      noValidate
    >
      <div className="flex flex-col space-y-5">
        <div className="flex flex-col md:flex-row space-y-5 md:space-y-0">
          <Input
            labelKey="forms:label-name-required"
            placeholderKey="forms:placeholder-name"
            {...register("name", { required: "forms:name-required" })}
            className="w-full md:w-1/2 "
            errorKey={errors.name?.message}
            variant="solid"
          />
          <Input
            labelKey="forms:label-email-required"
            type="email"
            placeholderKey="forms:placeholder-email"
            {...register("email", {
              required: "forms:email-required",
              pattern: {
                value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "forms:email-error",
              },
            })}
            className="w-full md:w-1/2 md:ms-2.5 lg:ms-5 mt-2 md:mt-0"
            errorKey={errors.email?.message}
            variant="solid"
          />
        </div>
        <Input
          labelKey="forms:label-phone"
          placeholderKey="forms:placeholder-phone"
          {...register("phone")}
          className="relative"
          variant="solid"
        />
        <TextArea
          labelKey="forms:label-message"
          {...register("message")}
          className="relative mb-2"
          placeholderKey="forms:placeholder-message"
        />
        <label className="flex items-center gap-2 text-xs text-gray-600">
          <input type="checkbox" {...register("remember")} />
          <span>Save my name, email, and phone in this browser for the next time I comment.</span>
        </label>
        <div className="relative">
          <Button
            type="submit"
            className="h-10 lg:h-11 mt-1 text-xs lg:text-sm w-full sm:w-auto"
            disabled={submitting}
          >
            SUBMIT NOW
          </Button>
        </div>
        {submitted?.ok && (
          <p className="text-green-600 text-sm mt-2">Thanks! We have received your details.</p>
        )}
        {submitted && !submitted.ok && (
          <p className="text-red-600 text-sm mt-2">{submitted.error}</p>
        )}
      </div>
    </form>
  );
};

export default ContactForm;
