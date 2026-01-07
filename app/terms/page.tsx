import Link from "next/link"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#050709] text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm text-emerald-300 hover:text-emerald-200">
          ← Back to home
        </Link>
        <h1 className="mt-4 text-3xl font-semibold">Terms of Service</h1>
        <p className="mt-2 text-sm text-white/60">Last updated: January 2026</p>

        <div className="mt-8 space-y-6 text-sm text-white/75">
          <section>
            <h2 className="text-lg font-semibold text-white">Agreement</h2>
            <p className="mt-2">
              By accessing or using ThumbGenius, you agree to these Terms. If you do not agree,
              do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">Use of the service</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>You are responsible for the content you generate and upload.</li>
              <li>Do not use the service for illegal, harmful, or abusive content.</li>
              <li>We may suspend accounts that violate these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">Subscriptions & credits</h2>
            <p className="mt-2">
              Paid plans provide monthly credits. Credit usage is tracked per request. Unused
              credits may reset on renewal depending on your plan.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">Availability</h2>
            <p className="mt-2">
              We strive for reliable service but do not guarantee uninterrupted access. Features
              may change as we improve the product.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">Contact</h2>
            <p className="mt-2">
              Questions about these terms? Email{" "}
              <a className="text-emerald-300 hover:text-emerald-200" href="mailto:malikx029squaddie@gmail.com">
                malikx029squaddie@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
