import Link from "next/link";

export function PublicContentNotice() {
  return (
    <div className="border-b border-black/[0.08] bg-[#ededeb] px-5 py-3 text-[12px] leading-5 text-[#555] dark:border-white/[0.1] dark:bg-[#151515] dark:text-[#bbb] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1240px]">
        The restored public notes, questions, roadmaps, quizzes, DSA sheets, and WebDev pages read from the Public content editor. Some older forms here edit separate records. <Link href="/admin/dashboard/content" className="font-semibold text-[#151515] underline underline-offset-4 dark:text-[#f3f3f1]">Edit the public pages</Link>.
      </div>
    </div>
  );
}
