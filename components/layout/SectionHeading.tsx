import { Icon, type IconName } from "@/components/ui/Icon";

type SectionHeadingProps = {
  index: string;
  title: string;
  note: string;
  icon: IconName;
};

export function SectionHeading({ index, title, note, icon }: SectionHeadingProps) {
  return (
    <header className="section-heading">
      <span className="section-index">#{index}</span>
      <h2><span aria-hidden="true">#</span> {title}<Icon className="section-heading-icon" name={icon} size={17} /></h2>
      <p className="section-note">{note}</p>
    </header>
  );
}
