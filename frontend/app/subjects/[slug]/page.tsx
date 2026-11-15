import { ComingSoonPage } from "@/components/coming-soon-page";
import ComputerNetworksPage from "@/components/subjects/computer-networks/computer-networks-page";
import DbmsPage from "@/components/subjects/dbms/dbms-page";
import DeepLearningPage from "@/components/subjects/deep-learning/deep-learning-page";
import MachineLearningPage from "@/components/subjects/machine-learning/machine-learning-page";
import ModernComputerArchitecturePage from "@/components/subjects/modern-computer-architecture/modern-computer-architecture-page";
import OopPage from "@/components/subjects/oop/oop-page";
import OperatingSystemsPage from "@/components/subjects/operating-systems/operating-systems-page";
import { getSubject } from "@/lib/subjects";
import type { SubjectContent } from "@/lib/subject-content";
import { getCatalogSubjects } from "@/lib/subject-catalog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type SubjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: SubjectPageProps): Promise<Metadata> {
  const { slug: subjectSlug } = await params;
  const subjects = await getCatalogSubjects();
  const subject = subjects.find((item) => item.slug === subjectSlug);
  if (!subject) return {};

  if (subject.availability === "available") {
    return {
      title: `${subject.name} | PrepLoom`,
      description: `Learn ${subject.name} with detailed notes, quick review, recall cues, and flexible reading layouts.`,
    };
  }

  return {
    title: `${subject.name} Notes Coming Soon | PrepLoom`,
    description: `${subject.name} notes are coming soon to PrepLoom. Study Operating Systems while new subjects are being prepared.`,
  };
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { slug } = await params;
  const subjects = await getCatalogSubjects();
  const original = subjects.find((item) => item.slug === slug);
  const { subject } = await getSubject(slug);
  if (!original && !subject) notFound();
  if (!subject?.course) {
    const name = original?.name ?? subject?.name ?? "Subject";
    return (
      <ComingSoonPage
        title={`${name} notes`}
        description={`${name} notes are being prepared. You can study Operating Systems now and return here when this subject is released.`}
      />
    );
  }
  const course = subject.course as SubjectContent;
  switch (slug) {
    case "operating-systems":
      return <OperatingSystemsPage course={course} />;
    case "oop":
      return <OopPage course={course} />;
    case "dbms":
      return <DbmsPage course={course} />;
    case "computer-networks":
      return <ComputerNetworksPage course={course} />;
    case "machine-learning":
      return <MachineLearningPage course={course} />;
    case "deep-learning":
      return <DeepLearningPage course={course} />;
    case "modern-computer-architecture":
      return <ModernComputerArchitecturePage course={course} />;
    default:
      return (
        <ComingSoonPage
          title={`${subject.name} notes`}
          description="These notes are being prepared."
        />
      );
  }
}
