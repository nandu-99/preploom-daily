import { ArrowDown, ArrowRight } from "lucide-react";

const frameClass =
  "overflow-hidden rounded-[14px] border border-black/[0.1] bg-[#ededeb] dark:border-white/[0.11] dark:bg-[#121212]";
const captionClass =
  "border-t border-black/[0.1] px-5 py-3 text-[11px] leading-5 text-[#777] dark:border-white/[0.11] dark:text-[#999]";

export function ArchitectureDiagram() {
  const parts = [
    {
      layer: "Frontend",
      title: "Next.js",
      lines: [
        "Study pages and admin editor",
        "Quiz player and search UI",
        "Algorithm steps run locally",
      ],
    },
    {
      layer: "Server",
      title: "Express",
      lines: [
        "Public and protected routes",
        "Content checks and quiz grading",
        "JWT admin access",
      ],
    },
    {
      layer: "Data access",
      title: "Prisma",
      lines: [
        "Models and relations",
        "Migrations and typed queries",
        "PostgreSQL adapter",
      ],
    },
    {
      layer: "Database",
      title: "PostgreSQL",
      lines: [
        "Learning content",
        "Admin and submissions",
        "Relational and JSON fields",
      ],
    },
  ];

  return (
    <figure className={frameClass}>
      <div className="border-b border-black/[0.1] px-5 py-3 dark:border-white/[0.11]">
        <h3 className="text-[13px] font-medium">Component architecture</h3>
        <p className="mt-1 text-[11px] text-[#606060] dark:text-[#a8a8a8]">
          Where each part of the application runs
        </p>
      </div>
      <div className="grid gap-2 p-4 sm:grid-cols-[minmax(0,1fr)_20px_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_16px_minmax(0,1fr)_16px_minmax(0,1fr)_16px_minmax(0,1fr)] xl:items-center">
        {parts.map((part, index) => (
          <div key={part.title} className="contents">
            {index > 0 && (
              <div
                className={`flex items-center justify-center text-[#888] dark:text-[#777] ${index === 2 ? "sm:col-span-3 xl:col-span-1" : ""}`}
                aria-hidden="true"
              >
                <ArrowRight
                  className={`size-4 rotate-90 ${index === 2 ? "xl:rotate-0" : "sm:rotate-0"}`}
                  strokeWidth={1.5}
                />
              </div>
            )}
            <div className="h-full rounded-[10px] border border-black/[0.1] bg-[#f7f7f5] p-4 dark:border-white/[0.13] dark:bg-[#0a0a0a]">
              <span className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.08em] text-[#777] dark:text-[#999]">
                {part.layer}
              </span>
              <strong className="mt-2 block text-[15px] font-semibold">
                {part.title}
              </strong>
              <ul className="mt-3 space-y-1.5 text-[11px] leading-5 text-[#606060] dark:text-[#a8a8a8]">
                {part.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <figcaption className={captionClass}>
        Browser to server uses HTTP. Express uses Prisma to read and write
        PostgreSQL. The visualizer can advance steps without a server request.
      </figcaption>
    </figure>
  );
}

type ModelBoxProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  fields: string[];
};

function ModelBox({ x, y, width, height, name, fields }: ModelBoxProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="9"
        className="fill-[#f7f7f5] stroke-black/20 dark:fill-[#181818] dark:stroke-white/25"
      />
      <path
        d={`M ${x} ${y + 34} H ${x + width}`}
        className="stroke-black/15 dark:stroke-white/20"
      />
      <text
        x={x + 14}
        y={y + 22}
        className="fill-[#151515] font-[family-name:var(--font-geist-sans)] text-[14px] font-semibold dark:fill-[#f3f3f1]"
      >
        {name}
      </text>
      {fields.map((field, index) => (
        <text
          key={field}
          x={x + 14}
          y={y + 57 + index * 20}
          className="fill-[#555] font-[family-name:var(--font-geist-mono)] text-[11px] dark:fill-[#bbb]"
        >
          {field}
        </text>
      ))}
    </g>
  );
}

export function DataModelDiagram() {
  const children = [
    {
      y: 20,
      name: "Topic",
      fields: ["subjectId: String", "slug: String", "position: Int"],
    },
    {
      y: 145,
      name: "Question",
      fields: ["subjectId: String", "slug: String", "answer: String"],
    },
    {
      y: 270,
      name: "Roadmap",
      fields: ["subjectId: String", "steps: Json", "position: Int"],
    },
    {
      y: 395,
      name: "Quiz",
      fields: ["subjectId: String", "definition: Json?", "position: Int"],
    },
  ];

  return (
    <figure className={frameClass}>
      <div className="border-b border-black/[0.1] px-5 py-3 dark:border-white/[0.11]">
        <h3 className="text-[13px] font-medium">UML-style data model</h3>
        <p className="mt-1 text-[11px] text-[#606060] dark:text-[#a8a8a8]">
          Core learning records from the Prisma schema
        </p>
      </div>
      <div className="overflow-x-auto p-4 sm:p-6">
        <svg
          viewBox="0 0 940 520"
          role="img"
          aria-labelledby="data-model-title data-model-description"
          className="min-w-[940px] w-full text-[#888] dark:text-[#777]"
        >
          <title id="data-model-title">Core PrepLoom data model</title>
          <desc id="data-model-description">
            One Subject has many Topics, Questions, Roadmaps, and Quizzes. One
            Quiz has many QuizQuestions. Subject course and Quiz definition use
            JSON fields.
          </desc>
          <path
            d="M 225 239 H 281 M 281 67 V 442 M 281 67 H 342 M 281 192 H 342 M 281 317 H 342 M 281 442 H 342 M 562 442 H 687"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <text
            x="239"
            y="229"
            className="fill-[#606060] font-[family-name:var(--font-geist-mono)] text-[10px] dark:fill-[#aaa]"
          >
            1
          </text>
          {children.map(({ y }) => (
            <text
              key={y}
              x="297"
              y={y + 42}
              className="fill-[#606060] font-[family-name:var(--font-geist-mono)] text-[10px] dark:fill-[#aaa]"
            >
              0..*
            </text>
          ))}
          <text
            x="572"
            y="430"
            className="fill-[#606060] font-[family-name:var(--font-geist-mono)] text-[10px] dark:fill-[#aaa]"
          >
            1
          </text>
          <text
            x="646"
            y="430"
            className="fill-[#606060] font-[family-name:var(--font-geist-mono)] text-[10px] dark:fill-[#aaa]"
          >
            0..*
          </text>
          <ModelBox
            x={20}
            y={170}
            width={205}
            height={138}
            name="Subject"
            fields={["id: String", "slug: String", "course: Json?"]}
          />
          {children.map(({ y, name, fields }) => (
            <ModelBox
              key={name}
              x={342}
              y={y}
              width={220}
              height={108}
              name={name}
              fields={fields}
            />
          ))}
          <ModelBox
            x={687}
            y={395}
            width={233}
            height={108}
            name="QuizQuestion"
            fields={["quizId: String", "options: Json", "correctOption: Int"]}
          />
        </svg>
      </div>
      <figcaption className={captionClass}>
        The 1 and 0..* labels show one-to-many relationships. This diagram shows
        the schema, including separate Topic and QuizQuestion records. The
        public lesson reader uses Subject.course, and the public quiz uses
        Quiz.definition. Other tables store DSA sheets, resources, admin
        accounts, and submissions.
      </figcaption>
    </figure>
  );
}

function SequenceArrow({
  from,
  to,
  y,
  label,
}: {
  from: number;
  to: number;
  y: number;
  label: string;
}) {
  const forward = to > from;
  const arrowX = forward ? to - 9 : to + 9;
  return (
    <g>
      <path
        d={`M ${from} ${y} H ${to}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d={`M ${arrowX} ${y - 5} L ${to} ${y} L ${arrowX} ${y + 5}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <text
        x={(from + to) / 2}
        y={y - 9}
        textAnchor="middle"
        className="fill-[#555] font-[family-name:var(--font-geist-mono)] text-[11px] dark:fill-[#bbb]"
      >
        {label}
      </text>
    </g>
  );
}

export function QuizSequenceDiagram() {
  const actors = [
    { x: 120, label: "Browser" },
    { x: 480, label: "Express + Prisma" },
    { x: 840, label: "PostgreSQL" },
  ];
  const messages = [
    { from: 120, to: 480, y: 112, label: "GET /quizzes/:slug" },
    { from: 480, to: 840, y: 154, label: "read Quiz.definition" },
    { from: 840, to: 480, y: 196, label: "quiz data" },
    { from: 480, to: 120, y: 238, label: "questions without key" },
    { from: 120, to: 480, y: 292, label: "POST /grade { answers }" },
    { from: 480, to: 840, y: 334, label: "read Quiz.definition" },
    { from: 840, to: 480, y: 376, label: "quiz data" },
    { from: 480, to: 120, y: 418, label: "score + review details" },
  ];

  return (
    <figure className={frameClass}>
      <div className="border-b border-black/[0.1] px-5 py-3 dark:border-white/[0.11]">
        <h3 className="text-[13px] font-medium">Quiz grading sequence</h3>
        <p className="mt-1 text-[11px] text-[#606060] dark:text-[#a8a8a8]">
          The initial quiz response omits answers; grading returns the review
        </p>
      </div>
      <div className="overflow-x-auto p-4 sm:p-6">
        <svg
          viewBox="0 0 960 460"
          role="img"
          aria-labelledby="quiz-sequence-title quiz-sequence-description"
          className="min-w-[960px] w-full text-[#888] dark:text-[#777]"
        >
          <title id="quiz-sequence-title">Quiz grading sequence</title>
          <desc id="quiz-sequence-description">
            The browser fetches a quiz without answers. Express reads the quiz
            from PostgreSQL through Prisma. The browser then submits answers.
            Express reads the quiz again, computes the score, and returns the
            answer review.
          </desc>
          {actors.map(({ x, label }) => (
            <g key={label}>
              <rect
                x={x - 91}
                y={12}
                width={182}
                height={42}
                rx={8}
                className="fill-[#f7f7f5] stroke-black/20 dark:fill-[#181818] dark:stroke-white/25"
              />
              <text
                x={x}
                y={38}
                textAnchor="middle"
                className="fill-[#151515] font-[family-name:var(--font-geist-sans)] text-[13px] font-medium dark:fill-[#f3f3f1]"
              >
                {label}
              </text>
              <path
                d={`M ${x} 54 V 444`}
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 6"
              />
            </g>
          ))}
          {messages.map((message) => (
            <SequenceArrow key={`${message.y}-${message.label}`} {...message} />
          ))}
        </svg>
      </div>
      <figcaption className={captionClass}>
        The public GET response omits correct options. The POST response
        includes the score and review details. Quiz attempt state is saved in
        the visitor&apos;s browser.
      </figcaption>
    </figure>
  );
}

export function DsaPlaybackDiagram() {
  const stages = [
    ["Input", "Sorted values and a target"],
    ["Step builder", "binarySearchSteps(values, target)"],
    ["Current snapshot", "low, high, mid, line, status"],
  ];

  return (
    <figure className={frameClass}>
      <div className="border-b border-black/[0.1] px-5 py-3 dark:border-white/[0.11]">
        <h3 className="text-[13px] font-medium">
          How one visualization step plays
        </h3>
        <p className="mt-1 text-[11px] text-[#606060] dark:text-[#a8a8a8]">
          The current snapshot drives both the screen and the narration
        </p>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid items-center gap-2 sm:grid-cols-[1fr_18px_1fr_18px_1fr]">
          {stages.map(([title, description], index) => (
            <div key={title} className="contents">
              {index > 0 && (
                <ArrowRight
                  aria-hidden="true"
                  className="mx-auto size-4 rotate-90 text-[#888] dark:text-[#777] sm:rotate-0"
                  strokeWidth={1.5}
                />
              )}
              <div className="h-full rounded-[9px] border border-black/[0.1] bg-[#f7f7f5] p-4 dark:border-white/[0.13] dark:bg-[#0a0a0a]">
                <span className="font-[family-name:var(--font-geist-mono)] text-[10px] text-[#777] dark:text-[#999]">
                  0{index + 1}
                </span>
                <strong className="mt-2 block text-[13px] font-medium">
                  {title}
                </strong>
                <span className="mt-1 block font-[family-name:var(--font-geist-mono)] text-[10px] leading-5 text-[#606060] dark:text-[#a8a8a8]">
                  {description}
                </span>
              </div>
            </div>
          ))}
        </div>
        <ArrowDown
          aria-hidden="true"
          className="mx-auto my-3 size-4 text-[#888] dark:text-[#777]"
          strokeWidth={1.5}
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-[9px] border border-black/[0.1] bg-[#f7f7f5] p-4 dark:border-white/[0.13] dark:bg-[#0a0a0a]">
            <strong className="text-[13px] font-medium">Visual output</strong>
            <p className="mt-2 text-[11px] leading-5 text-[#606060] dark:text-[#a8a8a8]">
              Highlight the array range, pointers, and the snapshot&apos;s code
              line.
            </p>
          </div>
          <div className="rounded-[9px] border border-black/[0.1] bg-[#f7f7f5] p-4 dark:border-white/[0.13] dark:bg-[#0a0a0a]">
            <strong className="text-[13px] font-medium">Spoken output</strong>
            <p className="mt-2 text-[11px] leading-5 text-[#606060] dark:text-[#a8a8a8]">
              Build short sentences from the snapshot, then pass them to browser
              speech.
            </p>
          </div>
        </div>
        <div className="mt-2 rounded-[9px] border border-black/[0.1] bg-[#e4e4e1] px-4 py-3 text-[11px] leading-5 text-[#555] dark:border-white/[0.13] dark:bg-[#242424] dark:text-[#c4c4c4]">
          Playback advances when the visual hold and the spoken parts have both
          finished.
        </div>
      </div>
      <figcaption className={captionClass}>
        Back, Next, and the timeline change the snapshot cursor. Changing input
        builds a new step list. No animation frames or voice files are fetched
        from the backend.
      </figcaption>
    </figure>
  );
}
