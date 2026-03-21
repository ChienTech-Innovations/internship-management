import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function HeaderSection() {
  return (
    <>
      <div className="flex items-center justify-center">
        <Image
          src="/tma.webp"
          width={200}
          height={200}
          alt="Picture of the app"
          className="w-[160px] h-[60px]"
        />
        <div>
          <h1 className="text-3xl font-bold">InternHub</h1>
          <span className="text-md text-gray-600">Training Plan Report</span>
        </div>
      </div>
      <div className="text-md text-gray-500">
        Generated on{" "}
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        })}
      </div>
      <Separator className="bg-primary h-0.5" />
    </>
  );
}
