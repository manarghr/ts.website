// Terms of service
// File: src/app/terms/page.js
//
// Written against what the platform currently does, including the parts that do
// not work yet: section 6 says plainly that checkout is not connected, because
// promising a working payment flow in the terms while the code returns 402 is
// the kind of gap that causes disputes.
//
// Sources: src/lib/pricing.js (the 20% fee, the 10% member discount),
// src/lib/plans.js (plan names and prices), src/app/api/subscription/route.js
// (paid plans are refused until checkout exists), src/lib/ai/analysers.js
// (what the form analysis actually measures).
//
// NOTE: an accurate description of the product, not legal advice. Have a lawyer
// review this before taking real payments, and fill in CONTACT_EMAIL and
// GOVERNING_LAW.

import MainLayout from "@/components/layout/MainLayout";
import LegalDocument, { Section, Warning, Highlight } from "@/components/legal/LegalDocument";

export const metadata = {
  title: "Terms of Service - TrainSight",
  description:
    "The rules for using TrainSight: accounts, coach content, purchases, and the limits of the AI form analysis.",
};

// TODO: fill both of these in before launch.
const CONTACT_EMAIL = "support@example.com";
const GOVERNING_LAW = "[your country]";

const PLATFORM_FEE_PERCENT = 20;
const MEMBER_DISCOUNT_PERCENT = 10;

const mailto = "mailto:" + CONTACT_EMAIL;
const linkClass = "font-medium text-[#52796F] underline hover:text-[#354F52]";

export default function TermsOfService() {
  return (
    <MainLayout>
      <LegalDocument
        title="Terms of Service"
        lastUpdated="17 September 2026"
        summary="These are the rules for using TrainSight. The two sections worth reading properly are section 3, on what the AI form analysis can and cannot tell you, and section 4, on exercising safely."
      >
        <Section id="acceptance" title="1. Accepting these terms">
          <p>
            By creating an account or using TrainSight you agree to these terms. If you
            do not agree with them, please do not use the service.
          </p>
          <p>
            We may update these terms. If a change matters, we will say so in the app
            rather than quietly editing this page, and the date at the top will change.
          </p>
        </Section>

        <Section id="accounts" title="2. Your account">
          <ul className="list-disc space-y-2 pl-5">
            <li>Give accurate information when you sign up, and keep it current.</li>
            <li>
              Passwords must be at least 8 characters. Keep yours to yourself &mdash;
              you are responsible for what happens under your account.
            </li>
            <li>
              A single account is either a member account or a coach account, not both
              at once. Signing in as one signs you out of the other.
            </li>
            <li>
              You must be 16 or older. Tell us if you think a child has created an
              account.
            </li>
            <li>
              Do not share, sell or transfer your account, and do not create accounts to
              impersonate somebody else.
            </li>
          </ul>
        </Section>

        <Section id="ai-limits" title="3. What the AI form analysis is, and is not">
          <p>
            The form analysis estimates the position of your joints from your camera and
            measures angles between them. It is a useful mirror. It is not a coach, a
            physiotherapist or a medical device, and you should understand its limits
            before relying on it:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              It measures a <strong>flat, two-dimensional angle</strong> from one camera.
              It cannot see rotation towards or away from the lens, so it can miss a
              twisted knee or a rounded spine entirely.
            </li>
            <li>
              It reads the <strong>right-hand side</strong> of your body. Stand with your
              right side away from the camera and it is measuring joints it cannot
              properly see.
            </li>
            <li>
              It judges one frame at a time against fixed thresholds. It knows nothing
              about your injuries, your mobility, your proportions, or what your
              physiotherapist told you.
            </li>
            <li>
              Poor light, loose clothing, a cluttered background or a partly visible body
              all degrade it. When it is unsure it says so instead of guessing, and you
              should treat that as the honest answer it is.
            </li>
            <li>
              The rep counter can miscount, particularly if you start a set already at
              the bottom of the movement.
            </li>
          </ul>
          <Highlight>
            Use it as feedback, not as permission. A good form score is not proof that a
            movement is safe for <em>your</em> body, and a bad one is not proof that
            anything is wrong.
          </Highlight>
        </Section>

        <Section id="health" title="4. Exercise, injury and medical advice">
          <Warning>
            <strong>TrainSight does not provide medical advice.</strong> Nothing on this
            platform &mdash; not the programs, not the nutrition plans, not the AI
            feedback, not anything a coach tells you &mdash; is a diagnosis, a treatment
            or a substitute for a qualified professional.
          </Warning>
          <p>
            Physical exercise carries a risk of injury. Before starting a new program,
            speak to a doctor, especially if you are pregnant, recovering from injury or
            surgery, or have a heart, joint, blood pressure or metabolic condition.
          </p>
          <p>
            Stop immediately if you feel pain, dizziness or shortness of breath, and seek
            medical help. You train at your own risk, and you are responsible for
            deciding what is appropriate for your own body.
          </p>
        </Section>

        <Section id="coach-content" title="5. Coaches and their content">
          <p>
            Coaches are independent. They write their own programs and set their own
            prices; they are not our employees, and we do not verify their
            qualifications, review every program, or supervise the advice they give.
          </p>
          <p>If you publish content on TrainSight, as a coach or a member:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              It must be yours to publish, or you must have permission to publish it.
            </li>
            <li>
              It must not be dangerous, misleading, medical advice dressed up as
              coaching, or a promise of a specific physical result.
            </li>
            <li>
              You keep ownership of it, and you grant us the licence needed to host and
              display it on the platform for as long as it is published.
            </li>
            <li>
              We can remove content that breaks these terms or that is reported and found
              to be harmful.
            </li>
          </ul>
        </Section>

        <Section id="payments" title="6. Plans, purchases and coach earnings">
          <Warning>
            <strong>Checkout is not connected yet.</strong> Paid plans cannot currently
            be activated: asking for one is refused rather than charged. Do not rely on
            paid features being available, and do not send anyone money through the
            platform expecting it to be processed.
          </Warning>
          <p>When payments are enabled, the arrangement will be as follows:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Plans are Free Trial (7 days, once per account), Monthly and Annual, at the
              prices shown on the pricing page.
            </li>
            <li>
              TrainSight takes <strong>{PLATFORM_FEE_PERCENT}%</strong> of each coach
              sale. The coach receives the rest.
            </li>
            <li>
              Members on a paid plan get <strong>{MEMBER_DISCOUNT_PERCENT}%</strong> off
              coach items. That discount comes out of our fee, not the coach&rsquo;s
              earnings &mdash; a coach earns the same either way.
            </li>
            <li>
              Prices are recorded on the purchase as they were at the time of sale, so a
              later price change does not alter a past receipt.
            </li>
            <li>
              Buying an item gives you a personal licence to use it. It does not let you
              redistribute, resell or publish it.
            </li>
          </ul>
        </Section>

        <Section id="acceptable-use" title="7. Things you must not do">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Break into, overload, probe or disrupt the service, or try to reach data
              that is not yours.
            </li>
            <li>Scrape the platform or copy coach content out of it in bulk.</li>
            <li>Harass, threaten or abuse other users or coaches, in messages or reviews.</li>
            <li>Post fake reviews, or reviews of yourself.</li>
            <li>Upload malware, or content that is illegal where you or we are.</li>
            <li>Misrepresent your qualifications as a coach.</li>
          </ul>
        </Section>

        <Section id="availability" title="8. Availability">
          <p>
            We aim to keep TrainSight working but we do not guarantee it will be
            available, uninterrupted or error-free. Features may change or be withdrawn.
            The AI analysis needs a reasonably modern browser with camera access and
            WebAssembly support, and it will not work everywhere.
          </p>
        </Section>

        <Section id="termination" title="9. Ending it">
          <p>
            You can stop using TrainSight and ask us to delete your account at any time.
            We may suspend or close an account that breaks these terms, or that puts
            other users at risk. Where we can give notice first, we will.
          </p>
        </Section>

        <Section id="liability" title="10. Liability">
          <p>
            TrainSight is provided as it is. To the fullest extent the law allows, we are
            not liable for injury, loss or damage arising from exercise you chose to do,
            advice a coach gave you, or reliance on the AI form analysis.
          </p>
          <p>
            Nothing here limits liability that cannot legally be limited &mdash;
            including for death or personal injury caused by our own negligence, or for
            fraud.
          </p>
        </Section>

        <Section id="law" title="11. Governing law">
          <p>
            These terms are governed by the laws of {GOVERNING_LAW}, and its courts have
            jurisdiction over any dispute.
          </p>
        </Section>

        <Section id="contact" title="12. Contact">
          <p>
            Questions about these terms:{" "}
            <a href={mailto} className={linkClass}>
              {CONTACT_EMAIL}
            </a>
            . For what we do with your data, see the{" "}
            <a href="/privacy" className={linkClass}>
              Privacy Policy
            </a>
            .
          </p>
        </Section>
      </LegalDocument>
    </MainLayout>
  );
}
