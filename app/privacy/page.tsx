import Link from "next/link"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#050709] text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm text-emerald-300 hover:text-emerald-200">
          ← Back to home
        </Link>
        <h1 className="mt-4 text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-white/60">Last updated: January 2026</p>

        <div className="mt-8 space-y-6 text-sm text-white/75">
          <section>
            <h2 className="text-lg font-semibold text-white">Overview</h2>
            <p className="mt-2">
              ThumbGenius respects your privacy. This policy explains what data we collect, how we
              use it, and the choices you have. By using ThumbGenius, you agree to this policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">What we collect</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Account info: email, username, and authentication data.</li>
              <li>Usage data: prompts, thumbnails, and session activity to improve the product.</li>
              <li>Billing data: subscription status and purchase records (handled by our payment provider).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">How we use data</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Provide core features such as generation, analysis, and recreate workflows.</li>
              <li>Maintain security, prevent abuse, and enforce credit usage.</li>
              <li>Send service emails like verification codes and billing updates.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">Data retention</h2>
            <p className="mt-2">
              We keep data as long as your account is active or as needed to provide the service.
              You may request deletion by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">Contact</h2>
            <p className="mt-2">
              If you have questions, reach out at{" "}
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
