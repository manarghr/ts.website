// Privacy policy
// File: src/app/privacy/page.js
//
// Every claim on this page is checked against the code. If you change what the
// app stores, change this page in the same commit -- a policy that overstates
// what the software does is worse than no policy.
//
// Sources for the current text:
//   backend/utils/auth-helpers.js   - the user document and EDITABLE_FIELDS
//   backend/utils/session.js        - the cookie and the sessions collection
//   backend/utils/upload-helpers.js - where uploaded files are written
//   src/lib/ai/, src/components/AI/ - pose analysis, which never leaves the browser
//   src/lib/pricing.js              - what a purchase record contains
//
// NOTE: this is an accurate description of the software, not legal advice. Have
// a lawyer review it before taking real payments, and fill in CONTACT_EMAIL.

import MainLayout from "@/components/layout/MainLayout";
import LegalDocument, { Section, DataTable, Highlight } from "@/components/legal/LegalDocument";

export const metadata = {
  title: "Privacy Policy - TrainSight",
  description:
    "What TrainSight stores, what it never stores, and why. Pose analysis runs in your browser: camera footage is never uploaded.",
};

// TODO: replace with the address you want privacy requests sent to.
const CONTACT_EMAIL = "privacy@example.com";

const mailto = "mailto:" + CONTACT_EMAIL;
const linkClass = "font-medium text-[#52796F] underline hover:text-[#354F52]";

export default function PrivacyPolicy() {
  return (
    <MainLayout>
      <LegalDocument
        title="Privacy Policy"
        lastUpdated="17 September 2026"
        summary="This page explains exactly what TrainSight stores about you and what it does not. It is written to match what the software actually does, rather than to cover every eventuality in the broadest possible language."
      >
        <Highlight>
          <strong>Your camera never reaches us.</strong> The AI form analysis runs
          entirely inside your browser. No image, video or still frame from your
          camera is uploaded, transmitted or stored &mdash; not while you train, not
          afterwards. Rep counts and form scores are worked out on your device too.
        </Highlight>

        <Section id="who-we-are" title="1. Who this applies to">
          <p>
            TrainSight is a fitness platform where people follow training programs, buy
            content from coaches, and can check their exercise form with a pose model.
            This policy covers the TrainSight website and the accounts on it.
          </p>
        </Section>

        <Section id="camera" title="2. The AI form analysis, in detail">
          <p>
            This is the part people ask about most, so it is worth being precise. When
            you use the form-analysis page:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Your browser downloads a pose model from our own domain and runs it
              locally, the way a video filter runs locally.
            </li>
            <li>
              Frames from your camera are read straight from the video element into that
              model. They are never sent over the network, and nothing records them
              &mdash; the site contains no video-recording code at all.
            </li>
            <li>
              If you analyse a video file you already have, it is opened directly from
              your own disk in the browser. It is not uploaded.
            </li>
            <li>
              The results &mdash; joint angles, feedback, rep count &mdash; exist only
              in the page while it is open. Closing the tab discards them.
            </li>
            <li>Your camera is released as soon as you stop it or leave the page.</li>
          </ul>
          <p>
            An earlier version of this site sent frames to a server for analysis. That
            path has been removed and the endpoints that supported it are disabled.
          </p>
        </Section>

        <Section id="what-we-store" title="3. What we do store">
          <p>Only what an account needs in order to work:</p>
          <DataTable
            caption="Data TrainSight stores and the reason for each"
            rows={[
              ["Name, email, phone", "To identify your account and let you sign in."],
              [
                "Password",
                "Stored only as a bcrypt hash. We cannot read it, and neither can anyone who obtains the database.",
              ],
              [
                "Profile details you enter: gender, age, weight, height, experience, bio, rating",
                "To personalise programs and show your profile. All optional, and you can edit or clear them on your profile page.",
              ],
              [
                "Profile picture, and any images or videos you upload",
                "To display on your profile and on content you publish.",
              ],
              [
                "Content you publish: blog posts, programs, videos, announcements",
                "Because publishing it is the point.",
              ],
              [
                "Messages you send to coaches",
                "So the conversation still exists when you come back to it.",
              ],
              [
                "Follows, favourites, reviews and reports",
                "To show your coaches and saved items, and to act on reports.",
              ],
              [
                "Purchases: what you bought, the amounts, and your plan at the time",
                "A receipt has to keep saying what it said. Coaches are paid from these records.",
              ],
              [
                "Sign-in sessions",
                "One record per active sign-in, so we can tell it is really you.",
              ],
              ["Account timestamps: created, last sign-in", "Basic account administration."],
            ]}
          />
          <p>
            We do not ask for, and have no field for, payment card details, precise
            location, your contacts, or any health record beyond the figures you choose
            to type in yourself.
          </p>
        </Section>

        <Section id="public" title="4. What other people can see">
          <p>
            Your profile picture and anything you publish are served from a public web
            address. Treat them as public: someone with the link can open the file
            without signing in. Your email address, phone number and password are never
            shown to other users.
          </p>
          <p>
            Some profile sections can be switched between public and private on your
            profile page.
          </p>
        </Section>

        <Section id="cookies" title="5. Cookies and tracking">
          <p>
            TrainSight sets <strong>one</strong> cookie, called{" "}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[13px]">
              trainsight_session
            </code>
            . It holds a random identifier and nothing else &mdash; no name, no email,
            no preferences. The server looks that identifier up to see who is signed in.
            It is marked <em>httpOnly</em> (JavaScript cannot read it),{" "}
            <em>sameSite=lax</em> (it is not sent from other sites), and <em>secure</em>{" "}
            in production (HTTPS only). It expires after 30 days.
          </p>
          <Highlight>
            There are <strong>no</strong> analytics, advertising or tracking services on
            this site. No Google Analytics, no advertising pixels, no session recording,
            no third-party cookies. We do not profile you, and we have nothing to sell
            to anyone who would.
          </Highlight>
          <p>
            Fonts and the pose model are served from our own domain rather than a
            third-party CDN, so simply loading a page does not announce your visit to
            anybody else.
          </p>
        </Section>

        <Section id="sharing" title="6. Who else touches your data">
          <p>
            We do not sell your data and we do not share it for advertising. Two
            suppliers necessarily hold it in order to run the service:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>The database host</strong> (MongoDB Atlas) stores the records
              listed above.
            </li>
            <li>
              <strong>The application host</strong> (Vercel) serves the site and
              processes requests.
            </li>
          </ul>
          <p>
            We may also disclose data where the law requires it, or where it is
            necessary to investigate abuse or fraud.
          </p>
        </Section>

        <Section id="retention" title="7. How long we keep it">
          <p>
            Account records are kept while your account exists. Sign-in sessions delete
            themselves 30 days after they are created, automatically, at the database
            level. Purchase records are kept after an account closes, because they are
            financial records and coaches are paid from them.
          </p>
        </Section>

        <Section id="rights" title="8. Your rights">
          <p>You can ask us to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>give you a copy of what we hold about you;</li>
            <li>correct anything wrong, though most of it you can edit yourself;</li>
            <li>
              delete your account and its data, apart from purchase records we have to
              keep;
            </li>
            <li>stop processing your data, where you object to it.</li>
          </ul>
          <p>
            Write to{" "}
            <a href={mailto} className={linkClass}>
              {CONTACT_EMAIL}
            </a>
            . If you are in the UK or EU and think we have handled your data badly, you
            can also complain to your national data protection authority.
          </p>
        </Section>

        <Section id="security" title="9. How it is protected">
          <p>
            Passwords are hashed with bcrypt and never stored in a readable form.
            Sessions live on the server, so the cookie in your browser is useless on its
            own. Every action that touches your data checks your session on the server
            rather than trusting the page. Connections use HTTPS.
          </p>
          <p>
            No system is perfect. If you find a security problem, please report it to{" "}
            <a href={mailto} className={linkClass}>
              {CONTACT_EMAIL}
            </a>{" "}
            before disclosing it publicly.
          </p>
        </Section>

        <Section id="children" title="10. Children">
          <p>
            TrainSight is not intended for children under 16. If you believe a child has
            created an account, contact us and we will remove it.
          </p>
        </Section>

        <Section id="changes" title="11. Changes to this policy">
          <p>
            If what we store changes, this page changes with it and the date at the top
            is updated. Material changes will be announced in the app.
          </p>
        </Section>
      </LegalDocument>
    </MainLayout>
  );
}
