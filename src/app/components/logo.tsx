import Image from "next/legacy/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-1">
      <Image src="/wappen.png" width={100} height={54} alt="1. FCN Logo" />
      <h1 className="text-2xl">
        Jahrhundert+25<i>Elf</i>
      </h1>
    </div>
  );
}
