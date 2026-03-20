// Runs in the page's main JavaScript context (world: "MAIN").
// Overrides the HTMLMediaElement.prototype.playbackRate getter so that
// platforms like EasyLlama (which reload the page when playbackRate > 2)
// always see a value ≤ 2 while the real playback rate is applied freely.

export default defineUnlistedScript(() => {
  if (typeof HTMLMediaElement === "undefined") return
  if (
    (HTMLMediaElement.prototype as { __playbackRateOverridden?: boolean }).__playbackRateOverridden
  )
    return

  const desc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "playbackRate")
  if (!desc) return

  Object.defineProperty(HTMLMediaElement.prototype, "playbackRate", {
    get: function (this: HTMLMediaElement) {
      const real = desc.get!.call(this) as number
      // Lie to platform checkers — they see ≤ 2 while audio/video plays faster.
      return real > 2 ? 2 : real
    },
    set: function (this: HTMLMediaElement, val: number) {
      desc.set!.call(this, val)
    },
    configurable: true,
  })
  ;(HTMLMediaElement.prototype as { __playbackRateOverridden?: boolean }).__playbackRateOverridden =
    true
})
