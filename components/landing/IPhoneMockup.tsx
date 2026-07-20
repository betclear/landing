export function IPhoneMockup() {
  return (
    <div
      className="relative mx-auto w-[260px] sm:w-[300px]"
      aria-hidden="true"
    >
      <div className="absolute -inset-8 rounded-[40%] bg-primary/10 blur-3xl dark:bg-primary/15" />

      <div className="relative overflow-hidden rounded-[2.4rem] border border-border bg-accent shadow-elevated dark:bg-[#1c1c1e]">
        <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-3">
          <div className="h-6 w-28 rounded-full bg-black/90 dark:bg-black" />
        </div>

        <div className="relative aspect-[9/19.5] bg-gradient-to-b from-[#0b0b0d] to-[#151518] px-4 pb-5 pt-14 text-white">
          <div className="mb-6 flex items-center justify-between text-[11px] text-white/55">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/55" />
              <span className="h-1.5 w-3 rounded-full bg-white/55" />
            </div>
          </div>

          <div className="mb-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
              Protection
            </p>
            <h3 className="mt-1 text-[22px] font-semibold tracking-[-0.03em]">
              BetClear
            </h3>
            <p className="mt-1 text-[12px] leading-relaxed text-white/55">
              Gambling sites blocked on this iPhone
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium tracking-[-0.01em]">
                  Status
                </p>
                <p className="mt-0.5 text-[12px] text-white/50">
                  Profile installed
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-medium text-[#6cb6ff]">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Active
              </span>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {[
              { label: "Sportsbooks", value: "Blocked" },
              { label: "Online casinos", value: "Blocked" },
              { label: "Betting apps", value: "Blocked" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.04] px-3.5 py-3"
              >
                <span className="text-[12px] text-white/70">{item.label}</span>
                <span className="text-[12px] font-medium text-white/90">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-dashed border-white/10 px-3.5 py-3 text-center">
            <p className="text-[11px] leading-relaxed text-white/40">
              No VPN. No tracking. System-wide protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
