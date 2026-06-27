interface TitleProps {
  title: string;
  subtitle?: string;
}

function Title({ title, subtitle }: TitleProps) {
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div className="mt-1.5 w-10 h-0.5 bg-[#7163cc] rounded-full" />
      {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
    </div>
  );
}

export default Title;
