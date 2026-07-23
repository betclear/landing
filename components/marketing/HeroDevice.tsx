import Image from "next/image";

export function HeroDevice() {
  return (
    <section className="hero-device" aria-label="BetClear on iPhone">
      <Image
        src="/images/backgrounddevice.png"
        alt="BetClear blocking gambling websites on an iPhone"
        width={3024}
        height={1924}
        priority
        sizes="100vw"
        className="hero-device-image"
      />
    </section>
  );
}
