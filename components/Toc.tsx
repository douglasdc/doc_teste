export default function Toc({ heads, contentRef }: any) {
  return (
    <div>
      <div className="mb-2">
        <span className="text-sm font-bold">Nesta página</span>
      </div>

      {heads.map((h: any) => (
        <div key={h.url} className={"before:content-['◆'] before:mr-2 text-sm"}>
          <a href={h.url}>{h.title}</a>
        </div>
      ))}
    </div>
  );
}
