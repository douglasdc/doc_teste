function SidebarHeader({ label, route }: any) {
  return (
    <a
      className="text-sm mt-3 font-bold py-1 px-6 rounded hover:bg-red-100 hover:cursor-pointer flex"
      href={route}
    >
      {label}
    </a>
  );
}

function SidebarOption({ label, route }: any) {
  return (
    <a
      className="text-sm font-normal py-1 px-6 hover:bg-red-100 hover:cursor-pointer flex hover:text-"
      href={route}
    >
      {label}
    </a>
  );
}

function SidebarItem({ page }: any) {
  const { route, type, level } = page;
  const label = page.data?.title || page.route;
  if (level === 1) {
    return <SidebarHeader route={route} label={label} />;
  }

  if (level === 2) {
    return <SidebarOption route={route} label={label} />;
  }

  return null;
}

export default function Sidebar() {
  // @ts-ignore
  const pagesTree: any[] = process.env.pagesTree;

  function renderTree(pages: any[]) {
    return pages.map((o, i) => {
      return (
        <div key={i}>
          <SidebarItem page={o} />
          {renderTree(o.subPages)}
        </div>
      );
    });
  }

  return (
    <>
      <aside className="w-96 h-screen" aria-label="Sidebar">
        <div className="overflow-y-auto py-4 h-screen border-gray-200 border-r">
          <details>
            <summary>teste aqui</summary>
            <div>01</div>
            <div>02</div>
            <div>03</div>
          </details>
          {renderTree(pagesTree)}
        </div>
      </aside>
    </>
  );
}
