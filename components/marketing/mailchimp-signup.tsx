type MailchimpSignupProps = {
  /**
   * When you're ready to show the form publicly, flip this to true.
   */
  isVisible?: boolean;
};

export function MailchimpSignup({ isVisible = false }: MailchimpSignupProps) {
  const formAction = process.env.NEXT_PUBLIC_MAILCHIMP_FORM_ACTION;
  const honeyPotName =
    process.env.NEXT_PUBLIC_MAILCHIMP_HONEYPOT_NAME || "b_fake-honeypot-name";
  const audienceTags = process.env.NEXT_PUBLIC_MAILCHIMP_TAGS || "haunted-newsletter";

  // If Mailchimp isn't configured yet, keep it hidden and inert.
  if (!formAction) {
    return null;
  }

  return (
    <div className={isVisible ? "" : "hidden"} aria-hidden={!isVisible}>
      <p className="text-xs uppercase tracking-[0.28em] text-n-5">Newsletter</p>
      <p className="mb-4 text-sm text-n-4">
        Ενημερώσου όταν ανεβαίνουν νέα άρθρα. Βάλε το email σου και θα στέλνω ειδοποιήσεις
        χειροκίνητα.
      </p>
      <form
        action={formAction}
        method="post"
        target="_blank"
        rel="noreferrer"
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
        noValidate
      >
        <label className="sr-only" htmlFor="newsletter-email">
          Email
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="EMAIL"
          required
          autoComplete="email"
          placeholder="name@example.com"
          className="h-11 w-full rounded-md border border-n-7 bg-n-8 px-3 text-sm text-n-1 outline-none transition placeholder:text-n-5 focus:border-n-4"
        />
        <input type="hidden" name="tags" value={audienceTags} />
        <div className="absolute left-[-5000px]" aria-hidden="true">
          <input type="text" name={honeyPotName} tabIndex={-1} defaultValue="" />
        </div>
        <button
          type="submit"
          className="h-11 shrink-0 rounded-md bg-n-1 px-4 text-sm font-semibold text-n-8 transition hover:bg-n-2"
        >
          Εγγραφή
        </button>
      </form>
    </div>
  );
}
