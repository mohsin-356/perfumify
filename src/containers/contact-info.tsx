"use client";
import { FC } from "react";
import Image from "next/image";
import { IoLocationSharp, IoMail, IoCallSharp } from "react-icons/io5";
import Link from "@components/ui/link";
import { useTranslation } from "next-i18next";
const mapImage = "/assets/images/map-image.jpg";
const data = [
  {
    id: 1,
    slug: "https://maps.google.com/?q=B82TT%20St%20Agathas%20road%2093%20Birmingham%2C%20England%2C%20United%20Kingdom",
    icon: <IoLocationSharp />,
    name: "text-address",
    description: "B82TT St Agathas road 93, Birmingham, England, United Kingdom",
  },
  {
    id: 2,
    slug: "mailto:info@perfumify786.co.uk",
    icon: <IoMail />,
    name: "text-email",
    description: "info@perfumify786.co.uk",
  },
  {
    id: 3,
    slug: "tel:+447782274831",
    icon: <IoCallSharp />,
    name: "text-phone",
    description: "+447782274831",
  },
];
interface Props {
  image?: HTMLImageElement;
}
const ContactInfoBlock: FC<Props> = () => {
  const { t } = useTranslation("common");
  return (
    <div className="mb-6 lg:border lg:rounded-md border-gray-300 lg:p-7">
      <h4 className="text-2xl md:text-lg font-bold text-heading pb-7 md:pb-10 lg:pb-6 -mt-1">
        {t("text-find-us-here")}
      </h4>
      {data?.map((item: any) => (
        <div key={`contact--key${item.id}`} className="flex pb-7">
          <div className="flex flex-shrink-0 justify-center items-center p-1.5 border rounded-md border-gray-300 w-10 h-10">
            {item.icon}
          </div>
          <div className="flex flex-col ps-3 2xl:ps-4">
            <h5 className="text-sm font-bold text-heading">
              {t(`${item.name}`)}
            </h5>
            <Link href={item.slug} className="text-sm mt-0">
              {item.description}
            </Link>
          </div>
        </div>
      ))}
      <Image
        src={mapImage}
        alt={t("text-map")}
        width={800}
        height={400}
        className="rounded-md w-full h-auto"
      />
    </div>
  );
};

export default ContactInfoBlock;
