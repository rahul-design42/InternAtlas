

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle2,
  ExternalLink,
  FileText,
  UserRound,
  X,
} from "lucide-react";

type InternshipActionsProps = {
  internshipId: number;
  internshipTitle: string;
  companyName: string;
};

type ApplicationForm = {
  fullName: string;
  email: string;
  resumeUrl: string;
  coverLetter: string;
};

const EMPTY_FORM: ApplicationForm = {
  fullName: "",
  email: "",
  resumeUrl: "",
  coverLetter: "",
};

export default function InternshipActions({
  internshipId,
  internshipTitle,
  companyName,
}: InternshipActionsProps) {
  const [saved, setSaved] = useState(false);

  const [showApplication, setShowApplication] =
    useState(false);

  const [step, setStep] = useState(1);

  const [applicationSubmitted, setApplicationSubmitted] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  const [form, setForm] =
    useState<ApplicationForm>(EMPTY_FORM);

  const [errors, setErrors] =
    useState<Partial<ApplicationForm>>({});

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const savedItems: number[] = JSON.parse(
        localStorage.getItem("savedInternships") || "[]",
      );

      setSaved(
        savedItems.includes(internshipId),
      );
    });

    return () =>
      window.cancelAnimationFrame(frameId);
  }, [internshipId]);

  function handleSave() {
    const savedItems: number[] = JSON.parse(
      localStorage.getItem("savedInternships") || "[]",
    );

    let updatedItems: number[];

    if (saved) {
      updatedItems = savedItems.filter(
        (id) => id !== internshipId,
      );
    } else {
      updatedItems = [
        ...new Set([
          ...savedItems,
          internshipId,
        ]),
      ];
    }

    localStorage.setItem(
      "savedInternships",
      JSON.stringify(updatedItems),
    );

    setSaved(!saved);
  }

  function updateField(
    field: keyof ApplicationForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));
  }

  function validatePersonalDetails() {
    const nextErrors:
      Partial<ApplicationForm> = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName =
        "Please enter your full name.";
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      nextErrors.email =
        "Please enter your email address.";
    } else if (
      !emailPattern.test(form.email)
    ) {
      nextErrors.email =
        "Please enter a valid email address.";
    }

    if (!form.resumeUrl.trim()) {
      nextErrors.resumeUrl =
        "Please add your resume link.";
    } else {
      try {
        new URL(form.resumeUrl);
      } catch {
        nextErrors.resumeUrl =
          "Please enter a valid resume URL.";
      }
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  }

  function validateApplicationQuestion() {
    const nextErrors:
      Partial<ApplicationForm> = {};

    if (!form.coverLetter.trim()) {
      nextErrors.coverLetter =
        "Please answer this question.";
    } else if (
      form.coverLetter.trim().length < 30
    ) {
      nextErrors.coverLetter =
        "Please write at least 30 characters.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  }

  function continueFromPersonalDetails() {
    if (!validatePersonalDetails()) {
      return;
    }

    setStep(2);
  }

  function continueToReview() {
    if (!validateApplicationQuestion()) {
      return;
    }

    setStep(3);
  }

  async function handleApplicationSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch(
        "/api/applications",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            internshipId,
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            resumeUrl: form.resumeUrl.trim(),
            coverLetter:
              form.coverLetter.trim(),
          }),
        },
      );

      const result = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to submit application",
        );
      }

      setApplicationSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to submit application",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function openApplicationModal() {
    setShowApplication(true);
    setStep(1);
    setSubmitError("");
    setApplicationSubmitted(false);
  }

  function closeApplicationModal() {
    setShowApplication(false);
    setStep(1);
    setSubmitError("");
    setErrors({});
    setApplicationSubmitted(false);
  }

  return (
    <>
      {/* Main apply button */}
      <button
        type="button"
        onClick={openApplicationModal}
        className="mt-5 w-full rounded-md bg-[#008BDC] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0076bd]"
      >
        Apply now
      </button>

      {/* Save */}
      <button
        type="button"
        onClick={handleSave}
        className={`mt-3 flex w-full items-center justify-center gap-2 rounded-md border px-5 py-3 text-sm font-semibold transition ${
          saved
            ? "border-[#008BDC] bg-blue-50 text-[#008BDC]"
            : "border-slate-300 bg-white text-slate-700 hover:border-[#008BDC] hover:text-[#008BDC]"
        }`}
      >
        <Bookmark
          size={17}
          fill={
            saved
              ? "currentColor"
              : "none"
          }
        />

        {saved
          ? "Saved"
          : "Save internship"}
      </button>

      {/* Modal */}
      {showApplication && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-[2px] sm:p-5">

          <div className="max-h-[94vh] w-full max-w-[680px] overflow-y-auto rounded-xl bg-white shadow-2xl">

            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#008BDC]">
                  Internship application
                </p>

                <h2 className="mt-1 text-lg font-semibold text-slate-900 sm:text-xl">
                  {internshipTitle}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {companyName}
                </p>
              </div>

              <button
                type="button"
                onClick={closeApplicationModal}
                aria-label="Close application form"
                className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={20} />
              </button>
            </div>

            {applicationSubmitted ? (
              <SuccessScreen
                companyName={companyName}
                onClose={
                  closeApplicationModal
                }
              />
            ) : (
              <>
                {/* Progress */}
                <ApplicationProgress
                  step={step}
                />

                <div className="px-5 pb-7 sm:px-7">

                  {submitError && (
                    <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {submitError}
                    </div>
                  )}

                  {/* STEP 1 */}
                  {step === 1 && (
                    <div>
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">
                          Your details
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Enter the information
                          that will be shared
                          with the employer.
                        </p>
                      </div>

                      <div className="space-y-5">
                        <FormField
                          label="Full name"
                          error={
                            errors.fullName
                          }
                        >
                          <input
                            type="text"
                            value={
                              form.fullName
                            }
                            onChange={(event) =>
                              updateField(
                                "fullName",
                                event.target
                                  .value,
                              )
                            }
                            placeholder="Enter your full name"
                            className={inputClasses(
                              Boolean(
                                errors.fullName,
                              ),
                            )}
                          />
                        </FormField>

                        <FormField
                          label="Email address"
                          error={
                            errors.email
                          }
                        >
                          <input
                            type="email"
                            value={form.email}
                            onChange={(event) =>
                              updateField(
                                "email",
                                event.target
                                  .value,
                              )
                            }
                            placeholder="you@example.com"
                            className={inputClasses(
                              Boolean(
                                errors.email,
                              ),
                            )}
                          />
                        </FormField>

                        <FormField
                          label="Resume"
                          error={
                            errors.resumeUrl
                          }
                        >
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <div className="mb-3 flex items-start gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[#008BDC]">
                                <FileText
                                  size={18}
                                />
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  Add your
                                  resume link
                                </p>

                                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                                  You can use a
                                  Google Drive,
                                  OneDrive or
                                  public resume
                                  link.
                                </p>
                              </div>
                            </div>

                            <input
                              type="url"
                              value={
                                form.resumeUrl
                              }
                              onChange={(
                                event,
                              ) =>
                                updateField(
                                  "resumeUrl",
                                  event.target
                                    .value,
                                )
                              }
                              placeholder="https://drive.google.com/..."
                              className={inputClasses(
                                Boolean(
                                  errors.resumeUrl,
                                ),
                              )}
                            />

                            <p className="mt-2 text-xs text-slate-500">
                              Make sure the
                              employer has
                              permission to open
                              the link.
                            </p>
                          </div>
                        </FormField>
                      </div>

                      <div className="mt-7 flex justify-end">
                        <button
                          type="button"
                          onClick={
                            continueFromPersonalDetails
                          }
                          className="inline-flex items-center gap-2 rounded-md bg-[#008BDC] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0076bd]"
                        >
                          Continue
                          <ArrowRight
                            size={16}
                          />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <div>
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">
                          Application question
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Help the employer
                          understand why you
                          are suitable for this
                          opportunity.
                        </p>
                      </div>

                      <FormField
                        label="Why should you be hired for this internship?"
                        error={
                          errors.coverLetter
                        }
                      >
                        <textarea
                          rows={8}
                          value={
                            form.coverLetter
                          }
                          onChange={(event) =>
                            updateField(
                              "coverLetter",
                              event.target
                                .value,
                            )
                          }
                          placeholder="Mention your relevant skills, projects, experience, and why you are interested in this role."
                          className={`${inputClasses(
                            Boolean(
                              errors.coverLetter,
                            ),
                          )} resize-none`}
                        />

                        <div className="mt-2 flex justify-between gap-4 text-xs text-slate-400">
                          <span>
                            Keep your answer
                            relevant and
                            concise.
                          </span>

                          <span>
                            {
                              form.coverLetter
                                .length
                            }{" "}
                            characters
                          </span>
                        </div>
                      </FormField>

                      <div className="mt-7 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() =>
                            setStep(1)
                          }
                          className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <ArrowLeft
                            size={16}
                          />
                          Back
                        </button>

                        <button
                          type="button"
                          onClick={
                            continueToReview
                          }
                          className="inline-flex items-center gap-2 rounded-md bg-[#008BDC] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0076bd]"
                        >
                          Review application
                          <ArrowRight
                            size={16}
                          />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <form
                      onSubmit={
                        handleApplicationSubmit
                      }
                    >
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">
                          Review your
                          application
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Check your details
                          before submitting.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <ReviewCard
                          icon={
                            <UserRound
                              size={17}
                            />
                          }
                          title="Applicant"
                        >
                          <p className="font-semibold text-slate-800">
                            {
                              form.fullName
                            }
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {form.email}
                          </p>
                        </ReviewCard>

                        <ReviewCard
                          icon={
                            <FileText
                              size={17}
                            />
                          }
                          title="Resume"
                        >
                          <a
                            href={
                              form.resumeUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 break-all text-sm font-medium text-[#008BDC] hover:underline"
                          >
                            View resume
                            <ExternalLink
                              size={13}
                            />
                          </a>
                        </ReviewCard>

                        <ReviewCard
                          icon={
                            <Check
                              size={17}
                            />
                          }
                          title="Why should you be hired?"
                        >
                          <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                            {
                              form.coverLetter
                            }
                          </p>
                        </ReviewCard>
                      </div>

                      <div className="mt-7 flex items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            setStep(2)
                          }
                          className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <ArrowLeft
                            size={16}
                          />
                          Edit
                        </button>

                        <button
                          type="submit"
                          disabled={
                            submitting
                          }
                          className="rounded-md bg-[#008BDC] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0076bd] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {submitting
                            ? "Submitting..."
                            : "Submit application"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ApplicationProgress({
  step,
}: {
  step: number;
}) {
  return (
    <div className="px-5 py-5 sm:px-7">
      <div className="flex items-center">
        {[1, 2, 3].map(
          (number, index) => (
            <div
              key={number}
              className="flex flex-1 items-center last:flex-none"
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  step >= number
                    ? "bg-[#008BDC] text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {step > number ? (
                  <Check size={14} />
                ) : (
                  number
                )}
              </div>

              {index < 2 && (
                <div
                  className={`mx-2 h-[2px] flex-1 ${
                    step > number
                      ? "bg-[#008BDC]"
                      : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ),
        )}
      </div>

      <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-500">
        <span>Details</span>
        <span>Questions</span>
        <span>Review</span>
      </div>
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>

      <div className="mt-2">
        {children}
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </label>
  );
}

function ReviewCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <span className="text-[#008BDC]">
          {icon}
        </span>

        {title}
      </div>

      <div className="mt-3 pl-6">
        {children}
      </div>
    </div>
  );
}

function SuccessScreen({
  companyName,
  onClose,
}: {
  companyName: string;
  onClose: () => void;
}) {
  return (
    <div className="px-6 py-12 text-center sm:px-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircle2 size={34} />
      </div>

      <h3 className="mt-5 text-2xl font-semibold text-slate-900">
        Application submitted
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
        Your application has been sent
        successfully to {companyName}.
        The employer can now review your
        application.
      </p>

      <button
        type="button"
        onClick={onClose}
        className="mt-7 rounded-md bg-[#008BDC] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#0076bd]"
      >
        Done
      </button>
    </div>
  );
}

function inputClasses(
  hasError: boolean,
) {
  return `w-full rounded-md border px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
      : "border-slate-300 focus:border-[#008BDC] focus:ring-2 focus:ring-blue-100"
  }`;
}