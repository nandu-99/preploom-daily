import { ContentsNav } from "@/components/blog/contents-nav";
import {
  ArchitectureDiagram,
  DataModelDiagram,
  DsaPlaybackDiagram,
  QuizSequenceDiagram,
} from "@/components/blog/technical-diagrams";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ArrowDown, ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How PrepLoom Works | PrepLoom",
  description:
    "A clear look at the ideas, architecture, and technical decisions behind PrepLoom, a full-stack interview preparation platform.",
};

const sectionClass =
  "border-b border-black/[0.08] px-5 py-14 dark:border-white/[0.09] sm:px-6 sm:py-18 lg:px-8 lg:py-20";
const headingClass =
  "text-balance text-[clamp(1.9rem,3.5vw,3.1rem)] font-semibold leading-[1.05] tracking-[-0.05em]";
const bodyClass = "text-[15px] leading-8 text-[#555] dark:text-[#b3b3b3]";
const cardClass =
  "rounded-[12px] border border-black/[0.1] bg-white/55 p-5 dark:border-white/[0.11] dark:bg-[#121212]";
function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <p className="mb-5 flex items-center gap-3 font-[family-name:var(--font-geist-mono)] text-[11px] text-[#777] dark:text-[#999]">
      <span>{number}</span>
      <span className="h-px w-7 bg-black/20 dark:bg-white/20" />
      <span className="uppercase tracking-[0.12em]">{children}</span>
    </p>
  );
}

export default function BlogPage() {
  return (
    <div className="min-h-[100dvh] bg-[#f7f7f5] font-[family-name:var(--font-geist-sans)] text-[#151515] selection:bg-black selection:text-white dark:bg-[#0a0a0a] dark:text-[#f3f3f1] dark:selection:bg-white dark:selection:text-black">
      <a
        href="#blog-main"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-[10px] bg-[#151515] px-4 py-2 text-[13px] font-medium text-white transition-transform focus:translate-y-0 dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1]"
      >
        Skip to article
      </a>
      <SiteHeader />

      <main
        id="blog-main"
        className="mx-auto grid w-full max-w-[1600px] lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[248px_minmax(0,1fr)]"
      >
        <aside
          aria-label="Blog contents"
          className="hidden border-r border-black/[0.08] px-6 py-10 dark:border-white/[0.09] lg:sticky lg:top-[68px] lg:block lg:h-[calc(100dvh-68px)] lg:self-start lg:overflow-y-auto"
        >
          <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.12em] text-[#777] dark:text-[#999]">
            Contents
          </p>
          <ContentsNav />
          <div className="mt-8 hidden border-t border-black/[0.1] pt-6 dark:border-white/[0.11] lg:block">
            <p className="text-[11px] leading-5 text-[#777] dark:text-[#999]">
              A look at the product, its architecture, and the choices behind
              it.
            </p>
          </div>
        </aside>
        <article>
          <header className={`${sectionClass} pt-16 sm:pt-20 lg:pt-24`}>
            <div className="mx-auto max-w-[1060px]">
              <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#606060] dark:text-[#a8a8a8]">
                <span className="h-px w-7 bg-black/25 dark:bg-white/25" />
                Inside PrepLoom
              </p>
              <h1 className="mt-7 max-w-[900px] text-balance text-[clamp(2.8rem,6vw,5.6rem)] font-semibold leading-[0.96] tracking-[-0.065em]">
                How PrepLoom turns study content into guided practice.
              </h1>
              <p className="mt-8 max-w-[700px] text-pretty text-[17px] leading-8 text-[#555] dark:text-[#b3b3b3] sm:text-[19px]">
                PrepLoom brings lessons, practice questions, roadmaps, quizzes,
                and algorithm visualizations into one place. Here is how its
                Next.js interface, Express server, Prisma models, and PostgreSQL
                content work together.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="https://preploom.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-[9px] bg-[#151515] px-4 text-[12px] font-medium text-white hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1] dark:hover:bg-[#2b2b2b] dark:focus-visible:ring-white/50"
                >
                  Visit PrepLoom{" "}
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
                <a
                  href="https://github.com/nandu-99/preploom-daily"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-[9px] border border-black/[0.12] px-4 text-[12px] font-medium hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.14] dark:hover:bg-white/[0.06] dark:focus-visible:ring-white/50"
                >
                  View source{" "}
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              </div>
              <figure className="mt-10 overflow-hidden rounded-[14px] border border-black/[0.1] bg-[#181818] dark:border-white/[0.12]">
                <Image
                  src="/blog/study-workspace.jpg"
                  alt="Open study notebook, index cards, and pencil on a dark desk"
                  width={1672}
                  height={941}
                  priority
                  className="aspect-[2.25/1] w-full object-cover object-center"
                />
                <figcaption className="px-4 py-2.5 text-[11px] text-[#c4c4c4]">
                  Editorial illustration of a study workspace.
                </figcaption>
              </figure>
              <ContentsNav compact />
            </div>
          </header>

          <section id="problem" className={`${sectionClass} scroll-mt-[68px]`}>
            <div className="mx-auto grid max-w-[1060px] gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
              <div>
                <SectionLabel number="01">The problem</SectionLabel>
                <h2 className={headingClass}>
                  Good preparation needs a clear path.
                </h2>
              </div>
              <div className="space-y-5 lg:pt-9">
                <p className={bodyClass}>
                  Preparing for a technical interview often means switching
                  between notes, problem lists, videos, and quizzes. It is easy
                  to collect resources and still lose track of what to learn
                  next. PrepLoom gives each activity a place in the same study
                  flow.
                </p>
                <p className={bodyClass}>
                  A learner can choose a subject, read a topic in Learn mode,
                  return for a shorter Revise or Recall view, and then check
                  their understanding with questions and quizzes. Roadmaps help
                  decide the order. DSA sheets and visualizations make algorithm
                  practice easier to follow.
                </p>
                <div className={`${cardClass} mt-7`}>
                  <h3 className="text-[16px] font-semibold">
                    Project objectives
                  </h3>
                  <ol className="mt-4 space-y-3 text-[13px] leading-6 text-[#555] dark:text-[#b3b3b3]">
                    <li>
                      1. Put notes, roadmaps, questions, and practice tools in
                      one study flow.
                    </li>
                    <li>
                      2. Store learning content in PostgreSQL and let an admin
                      edit it through forms.
                    </li>
                    <li>
                      3. Grade practice quizzes on the server and return useful
                      answer reviews.
                    </li>
                    <li>
                      4. Make algorithm steps visible, controllable, and
                      connected to code and narration.
                    </li>
                  </ol>
                </div>
                <div className="grid gap-3 pt-2 sm:grid-cols-3">
                  {[
                    ["Learn", "Build the idea with structured notes."],
                    ["Practice", "Answer questions and inspect each step."],
                    ["Review", "Return to the parts that need another look."],
                  ].map(([title, description]) => (
                    <div key={title} className={cardClass}>
                      <h3 className="text-[14px] font-medium">{title}</h3>
                      <p className="mt-2 text-[12px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                        {description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            id="architecture"
            className={`${sectionClass} scroll-mt-[68px]`}
          >
            <div className="mx-auto max-w-[1060px]">
              <SectionLabel number="02">Architecture</SectionLabel>
              <h2 className={`${headingClass} max-w-[720px]`}>
                Four parts, with clear jobs.
              </h2>
              <p className={`${bodyClass} mt-5 max-w-[740px]`}>
                Next.js renders the pages and interactive study tools. Express
                provides direct routes such as{" "}
                <code className="font-[family-name:var(--font-geist-mono)] text-[0.9em]">
                  /subjects
                </code>
                ,{" "}
                <code className="font-[family-name:var(--font-geist-mono)] text-[0.9em]">
                  /quizzes
                </code>
                , and{" "}
                <code className="font-[family-name:var(--font-geist-mono)] text-[0.9em]">
                  /health
                </code>
                . Prisma connects the server to PostgreSQL, where editable
                learning content, admin accounts, and form submissions live.
              </p>
              <div className="mt-9">
                <ArchitectureDiagram />
              </div>
              <p className={`${bodyClass} mt-8 max-w-[740px]`}>
                We keep the algorithm animation in the browser, where each step
                can respond immediately to Play, Back, or Next. Content editing
                and quiz grading belong on the server, where the database and
                answer key are available.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className={cardClass}>
                  <h3 className="text-[14px] font-medium">A public read</h3>
                  <p className="mt-2 text-[12px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                    The subject page asks Express for a course. Express reads it
                    through Prisma and returns the content for Next.js to
                    render.
                  </p>
                </div>
                <div className={cardClass}>
                  <h3 className="text-[14px] font-medium">An admin write</h3>
                  <p className="mt-2 text-[12px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                    The editor sends a protected request. Express checks the
                    token and content shape before Prisma saves the change.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="content" className={`${sectionClass} scroll-mt-[68px]`}>
            <div className="mx-auto max-w-[1060px]">
              <SectionLabel number="03">Content and publishing</SectionLabel>
              <h2 className={`${headingClass} max-w-[750px]`}>
                Content can change without changing a page.
              </h2>
              <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
                <div className="space-y-5">
                  <p className={bodyClass}>
                    PostgreSQL stores the content shown on the public pages. The
                    public subject reader loads{" "}
                    <code className="font-[family-name:var(--font-geist-mono)] text-[0.9em]">
                      Subject.course
                    </code>
                    , a JSON field containing modules, lessons, examples, and
                    revision notes. The public quiz page similarly loads
                    <code className="font-[family-name:var(--font-geist-mono)] text-[0.9em]">
                      {" "}
                      Quiz.definition
                    </code>
                    . JSON keeps related sections and questions together as
                    structured documents. These shapes can vary more than a
                    simple title or date.
                  </p>
                  <p className={bodyClass}>
                    The admin portal turns that structure into labeled fields.
                    An editor can add sections, move items, review changes, and
                    save. The server checks the content before writing it. This
                    lets the public page keep its design while the words and
                    learning material change in the database.
                  </p>
                  <p className={bodyClass}>
                    A seed command loads the starting content. It skips records
                    that already exist, so running it again does not replace
                    later edits made in the admin portal.
                  </p>
                  <p className={bodyClass}>
                    The relational part gives each subject a stable address and
                    connects it to separate topic, question, roadmap, and quiz
                    records. Those records support their own management routes.
                    The reader and public quiz use the JSON fields above. This
                    choice avoids a table for every kind of paragraph, example,
                    and recall prompt while keeping core records related.
                  </p>
                </div>
                <figure className="self-start rounded-[16px] border border-black/[0.1] bg-[#ededeb] p-5 dark:border-white/[0.11] dark:bg-[#121212] sm:p-7">
                  <p className="mb-5 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.12em] text-[#777] dark:text-[#999]">
                    From edit to reader
                  </p>
                  <ol className="space-y-0">
                    {[
                      ["Admin editor", "Change a lesson in labeled fields."],
                      ["Express route", "Check the content and save it."],
                      ["PostgreSQL", "Keep the updated course data."],
                      ["Subject page", "Read and display the latest content."],
                    ].map(([title, description], index) => (
                      <li key={title}>
                        {index > 0 && (
                          <ArrowDown
                            aria-hidden="true"
                            className="my-2 ml-4 size-4 text-[#999] dark:text-[#777]"
                            strokeWidth={1.5}
                          />
                        )}
                        <div className="rounded-[9px] border border-black/[0.1] bg-[#f7f7f5] px-4 py-3 dark:border-white/[0.12] dark:bg-[#0a0a0a]">
                          <strong className="block text-[13px] font-medium">
                            {title}
                          </strong>
                          <span className="mt-1 block text-[11px] leading-5 text-[#606060] dark:text-[#a8a8a8]">
                            {description}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <figcaption className="mt-5 text-[11px] leading-5 text-[#777] dark:text-[#999]">
                    One edit reaches the public page through the same content
                    API.
                  </figcaption>
                </figure>
              </div>
              <div className="mt-8">
                <DataModelDiagram />
              </div>
              <div className="mt-5 rounded-[12px] border border-black/[0.1] bg-white/55 p-5 dark:border-white/[0.11] dark:bg-[#121212] sm:p-6">
                <h3 className="text-[15px] font-semibold">
                  The editing challenge
                </h3>
                <p className="mt-3 text-[13px] leading-7 text-[#606060] dark:text-[#a8a8a8]">
                  A rich lesson is useful to store as JSON, but raw JSON is easy
                  to break while editing. The admin portal shows labeled fields,
                  allows sections to be reordered, and checks required fields
                  before saving. The Express route repeats content checks before
                  writing to PostgreSQL.
                </p>
              </div>
            </div>
          </section>

          <section id="practice" className={`${sectionClass} scroll-mt-[68px]`}>
            <div className="mx-auto max-w-[1060px]">
              <SectionLabel number="04">
                Practice that explains itself
              </SectionLabel>
              <h2 className={`${headingClass} max-w-[760px]`}>
                Show the answer, and the path to it.
              </h2>
              <div id="quiz-grading" className="mt-10 scroll-mt-[82px]">
                <div className={cardClass}>
                  <p className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#777] dark:text-[#999]">
                    QUIZZES
                  </p>
                  <h3 className="mt-5 text-[21px] font-semibold tracking-[-0.035em]">
                    Grade on the server
                  </h3>
                  <p className={`${bodyClass} mt-3`}>
                    The public quiz response leaves out correct answers and
                    explanations. A grading request compares the supplied
                    answers with Quiz.definition and returns a score and review
                    details. This is a practice tool: even a partial answer set
                    can be graded. The player offers a timer and can resume its
                    state in the same browser.
                  </p>
                </div>
                <div className="mt-5">
                  <QuizSequenceDiagram />
                </div>
                <div className={`${cardClass} mt-5`}>
                  <h4 className="text-[15px] font-semibold">
                    A grading request
                  </h4>
                  <p className="mt-2 text-[13px] leading-7 text-[#606060] dark:text-[#a8a8a8]">
                    A learner selects option b for the operating systems
                    question. The server reads the saved quiz, scores that
                    answer, and includes the correct options and explanations in
                    its review.
                  </p>
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div className="min-w-0 rounded-[9px] bg-[#f1f1ef] p-4 dark:bg-[#0a0a0a]">
                      <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-[#777] dark:text-[#999]">
                        Request
                      </p>
                      <pre className="mt-2 overflow-x-auto font-[family-name:var(--font-geist-mono)] text-[11px] leading-6">{`POST /quizzes/operating-systems-foundations/grade
{"answers":{"os-role":"b"}}`}</pre>
                    </div>
                    <div className="min-w-0 rounded-[9px] bg-[#f1f1ef] p-4 dark:bg-[#0a0a0a]">
                      <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-[#777] dark:text-[#999]">
                        Response excerpt
                      </p>
                      <pre className="mt-2 overflow-x-auto font-[family-name:var(--font-geist-mono)] text-[11px] leading-6">{`{"data":{
  "score":1,
  "correctOptionIds":{"os-role":"b"},
  "reviewDetails":{"os-role":{
    "keyPoint":"The OS manages resources and provides services to programs."
  }}
}}`}</pre>
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] leading-5 text-[#777] dark:text-[#999]">
                    The response is shortened here. The actual response includes
                    review details for every question.
                  </p>
                </div>
              </div>
              <div id="dsa-playback" className="mt-14 scroll-mt-[82px]">
                <div className={cardClass}>
                  <p className="font-[family-name:var(--font-geist-mono)] text-[11px] text-[#777] dark:text-[#999]">
                    ALGORITHM VISUALIZATIONS
                  </p>
                  <h3 className="mt-5 text-[21px] font-semibold tracking-[-0.035em]">
                    Follow every step
                  </h3>
                  <p className={`${bodyClass} mt-3`}>
                    Seven visualizations cover searching and sorting. Each
                    algorithm builds a sequence of steps that records what
                    changed and which code line is active. The player uses those
                    steps for Play, Back, Next, and the highlighted line. A
                    learner can try custom values and see how the path changes.
                  </p>
                </div>
                <figure className="mt-5 overflow-hidden rounded-[12px] border border-black/[0.1] bg-[#181818] dark:border-white/[0.11]">
                  <Image
                    src="/blog/sorting-cards.jpg"
                    alt="Paper cards with bars of different heights arranged for a sorting demonstration"
                    width={1752}
                    height={897}
                    className="aspect-[2.8/1] w-full object-cover object-center"
                  />
                  <figcaption className="px-4 py-2.5 text-[11px] text-[#c4c4c4]">
                    Editorial illustration of values arranged for sorting.
                  </figcaption>
                </figure>
                <figure className="mt-4 overflow-hidden rounded-[12px] border border-black/[0.1] dark:border-white/[0.11]">
                  <div className="border-b border-black/[0.1] bg-[#ededeb] px-5 py-3 font-[family-name:var(--font-geist-mono)] text-[11px] text-[#606060] dark:border-white/[0.11] dark:bg-[#181818] dark:text-[#a8a8a8]">
                    One binary search step
                  </div>
                  <div className="grid gap-0 bg-white/55 dark:bg-[#121212] sm:grid-cols-4">
                    {[
                      ["Range", "positions 0 to 11"],
                      ["Middle", "index 5, value 31"],
                      ["Action", "choose midpoint"],
                      ["Code", "highlight line 4"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="border-b border-black/[0.08] px-5 py-5 last:border-b-0 dark:border-white/[0.09] sm:border-b-0 sm:border-r sm:last:border-r-0"
                      >
                        <span className="block font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-[#777] dark:text-[#999]">
                          {label}
                        </span>
                        <strong className="mt-2 block text-[13px] font-medium">
                          {value}
                        </strong>
                      </div>
                    ))}
                  </div>
                  <figcaption className="px-5 py-3 text-[11px] leading-5 text-[#777] dark:text-[#999]">
                    The first midpoint step when searching the default sorted
                    array for 42.
                  </figcaption>
                </figure>
                <div className="mt-8">
                  <h3 className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.045em]">
                    How the animation and narration work
                  </h3>
                  <p className={`${bodyClass} mt-4 max-w-[760px]`}>
                    Binary search first checks the input. It accepts up to 20
                    whole numbers in sorted order and a whole-number target. The
                    step builder then runs the search once and saves a complete
                    snapshot for every teaching phase: ready, select, compare,
                    narrow, found, or missing. Each snapshot holds the current
                    bounds, middle index, comparison count, explanation, and
                    code line.
                  </p>
                  <div className="mt-6">
                    <DsaPlaybackDiagram />
                  </div>
                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <div className={cardClass}>
                      <h4 className="text-[15px] font-semibold">
                        A step controls the view
                      </h4>
                      <p className="mt-3 text-[13px] leading-7 text-[#606060] dark:text-[#a8a8a8]">
                        A cursor selects one snapshot. Its bounds draw the
                        search range, its middle index points to a value, and
                        its line number highlights the matching line of Python
                        code. Back and Next move the cursor, so rewinding does
                        not have to reverse the algorithm itself.
                      </p>
                    </div>
                    <div className={cardClass}>
                      <h4 className="text-[15px] font-semibold">
                        Text becomes speech
                      </h4>
                      <p className="mt-3 text-[13px] leading-7 text-[#606060] dark:text-[#a8a8a8]">
                        The narration function uses the step&apos;s status and
                        values to build short, prepared sentences. For example,
                        the first comparison says that 31 is smaller than 42 and
                        explains why the left side can be skipped. The browser
                        speaks those sentences with its Web Speech API.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 grid overflow-hidden rounded-[12px] border border-black/[0.1] bg-white/55 dark:border-white/[0.11] dark:bg-[#121212] md:grid-cols-2">
                    <div className="border-b border-black/[0.1] p-5 dark:border-white/[0.11] md:border-b-0 md:border-r">
                      <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-[#777] dark:text-[#999]">
                        Example snapshot
                      </p>
                      <pre className="mt-3 overflow-x-auto font-[family-name:var(--font-geist-mono)] text-[12px] leading-6 text-[#444] dark:text-[#d0d0d0]">{`status: "compare"
mid: 5
value: 31
target: 42
line: 7`}</pre>
                    </div>
                    <div className="p-5">
                      <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-[#777] dark:text-[#999]">
                        Narration built from that step
                      </p>
                      <p className="mt-3 text-[13px] leading-7 text-[#444] dark:text-[#d0d0d0]">
                        “31 is smaller than 42.”
                      </p>
                      <p className="mt-2 text-[12px] leading-6 text-[#606060] dark:text-[#a8a8a8]">
                        The next sentence explains why the sorted left side can
                        be skipped. Each part has a short pause before the next
                        sentence starts.
                      </p>
                    </div>
                  </div>
                  <p className={`${bodyClass} mt-5 max-w-[760px]`}>
                    Narration is optional. When it is on, the player waits for
                    both the visual delay and the spoken parts before moving to
                    the next step. Some narration parts include a movement cue,
                    so a pointer moves when the explanation reaches that action.
                    Pausing or jumping to another step cancels pending speech.
                    If speech is unavailable, the written explanation still
                    appears beside the animation.
                  </p>
                  <p className={`${bodyClass} mt-4 max-w-[760px]`}>
                    Before speaking, the player turns numbers into words so the
                    selected browser voice reads them clearly. The spoken script
                    comes from the current step and its values; playback does
                    not need recorded audio files.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="outcomes" className={`${sectionClass} scroll-mt-[68px]`}>
            <div className="mx-auto max-w-[1060px]">
              <SectionLabel number="05">Key outcomes</SectionLabel>
              <h2 className={`${headingClass} max-w-[750px]`}>
                A working path from content to practice.
              </h2>
              <p className={`${bodyClass} mt-5 max-w-[760px]`}>
                The implemented product connects subject reading, revision,
                questions, quizzes, roadmaps, and DSA practice. The admin editor
                can update the database content used by the public pages. Quiz
                grading runs through Express, while seven searching and sorting
                visualizations build and play their steps in the browser.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  [
                    "Editable content",
                    "A single seed command loads starting material; admin forms support later edits.",
                  ],
                  [
                    "Guided assessment",
                    "The quiz player submits answers for a score and question-by-question review.",
                  ],
                  [
                    "Visible execution",
                    "Each algorithm step updates the animation, explanation, and highlighted code line.",
                  ],
                ].map(([title, description]) => (
                  <div key={title} className={cardClass}>
                    <h3 className="text-[15px] font-semibold">{title}</h3>
                    <p className="mt-3 text-[13px] leading-7 text-[#606060] dark:text-[#a8a8a8]">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[12px] leading-6 text-[#777] dark:text-[#999]">
                These are implemented capabilities, not measured improvements in
                interview results. A learner study would be needed to measure
                that impact.
              </p>
            </div>
          </section>

          <section
            id="decisions"
            className={`${sectionClass} scroll-mt-[68px]`}
          >
            <div className="mx-auto grid max-w-[1060px] gap-9 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
              <div>
                <SectionLabel number="06">Decisions and limits</SectionLabel>
                <h2 className={headingClass}>
                  Keep each tool honest about its job.
                </h2>
              </div>
              <div className="divide-y divide-black/[0.1] border-t border-black/[0.1] dark:divide-white/[0.11] dark:border-white/[0.11]">
                {[
                  [
                    "Search",
                    "Express builds a catalog from the stored content. The frontend ranks exact names, prefixes, keywords, and close matches. This keeps the search easy to use, but it is application-level ranking rather than a database search index.",
                  ],
                  [
                    "Admin access",
                    "Admin passwords are stored as bcrypt hashes. After sign-in, Express issues a time-limited JWT, a signed login token. Protected routes check that token before allowing content edits or message reads.",
                  ],
                  [
                    "Progress",
                    "Reading and quiz progress stays in the learner's browser. It makes it easy to resume on that device, but it does not sync between devices.",
                  ],
                  [
                    "Checks",
                    "Prisma migrations define the schema. The /health route checks PostgreSQL and returns 200 when it responds or 503 when it does not. Frontend tests check linear search steps, quick sort behavior, and custom input limits. Backend tests check content rules; database and HTTP checks need a database and a local listener.",
                  ],
                ].map(([title, description]) => (
                  <div
                    key={title}
                    className="grid gap-2 py-5 sm:grid-cols-[135px_1fr] sm:gap-6"
                  >
                    <h3 className="text-[14px] font-medium">{title}</h3>
                    <p className="text-[13px] leading-7 text-[#606060] dark:text-[#a8a8a8]">
                      {description}
                    </p>
                  </div>
                ))}
                <div className="py-6">
                  <h3 className="text-[14px] font-medium">
                    How to verify the core flow
                  </h3>
                  <p className="mt-2 text-[13px] leading-7 text-[#606060] dark:text-[#a8a8a8]">
                    Run the frontend tests to check algorithm steps and input
                    handling. With PostgreSQL configured, run the backend tests
                    for content rules and API behavior, then open a subject,
                    submit a practice quiz, and step through binary search in
                    the app. The database checks require TEST_DATABASE_URL.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="future" className={`${sectionClass} scroll-mt-[68px]`}>
            <div className="mx-auto max-w-[1060px]">
              <SectionLabel number="07">Future scope</SectionLabel>
              <h2 className={`${headingClass} max-w-[750px]`}>
                Next steps follow the current limits.
              </h2>
              <p className={`${bodyClass} mt-5 max-w-[760px]`}>
                These are proposed extensions. They are not part of the current
                implementation.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  [
                    "Saved practice history",
                    "Add learner accounts and store quiz attempts and completed lessons in PostgreSQL. Progress could then follow a learner across devices.",
                  ],
                  [
                    "Content revision history",
                    "Record each admin edit with its author, time, and previous content. An admin could compare versions and restore a mistaken change.",
                  ],
                  [
                    "Indexed content search",
                    "Move catalog matching into PostgreSQL with a searchable text index. Compare relevance and response time with the current browser ranking before replacing it.",
                  ],
                ].map(([title, description]) => (
                  <div key={title} className={cardClass}>
                    <h3 className="text-[15px] font-semibold">{title}</h3>
                    <p className="mt-3 text-[13px] leading-7 text-[#606060] dark:text-[#a8a8a8]">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <div className="mx-auto grid max-w-[1060px] gap-8 rounded-[18px] border border-black/[0.1] bg-[#ededeb] p-6 dark:border-white/[0.11] dark:bg-[#121212] sm:p-9 lg:grid-cols-[1fr_auto] lg:items-end lg:p-12">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#606060] dark:text-[#a8a8a8]">
                  Try the project
                </p>
                <h2 className="mt-4 max-w-[620px] text-balance text-[clamp(2rem,3.7vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.05em]">
                  See the study flow for yourself.
                </h2>
                <p className={`${bodyClass} mt-4 max-w-[580px]`}>
                  Start with a subject, then try a quiz or step through an
                  algorithm.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/subjects"
                  className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#151515] px-4 text-[13px] font-medium text-white hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border dark:border-white/[0.14] dark:bg-[#242424] dark:text-[#f3f3f1] dark:hover:bg-[#2b2b2b] dark:focus-visible:ring-white/50"
                >
                  Explore subjects{" "}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={1.7}
                  />
                </Link>
                <Link
                  href="/dsa/visualizations/binary-search"
                  className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-black/[0.12] px-4 text-[13px] font-medium hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.13] dark:hover:bg-white/[0.05] dark:focus-visible:ring-white/50"
                >
                  Open a visualization{" "}
                  <ExternalLink
                    aria-hidden="true"
                    className="size-3.5"
                    strokeWidth={1.7}
                  />
                </Link>
                <Link
                  href="/quizzes/operating-systems-foundations"
                  className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-black/[0.12] px-4 text-[13px] font-medium hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 dark:border-white/[0.13] dark:hover:bg-white/[0.05] dark:focus-visible:ring-white/50"
                >
                  Try a quiz
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={1.7}
                  />
                </Link>
              </div>
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
