import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import cachePage from '../plugins/cachepages';
import Sidebar from './Sidebar';
import Toc from './Toc';

export default function Layout(props) {
  const router = useRouter();
  // const [num, setNum]=useState(2) 

  const {pagesTree}=process.env;

  function breadcum(){
    const pp = []
    const pagePath = router.pathname
    console.log('pp', pagePath)
    const t = pagePath.replace("/", "").split("/");

    let i = 0
    let fr = t[i++]
    let a = pagesTree?.find(e => e.route === fr);

    if (a !== undefined){
      
      pp.push(a)
      for(; i < t.length; i++) {
        fr = fr+"/"+t[i]
        a = a.subPages.find(e => e.route === fr)
        pp.push(a)
      }
    }

    console.log('bb', pp)
    return pp;
  }

  const getHeadings = (element) => {
    const headingSelector = [2, 3].map(level => `h${level}`).join(`, `);
    const pageNodes = Array.from(element.querySelectorAll(headingSelector));
    const tree= [];

    let pNode = pageNodes[0];
    let level = 0;
    pageNodes.forEach((node ) => {
      if (!node.id) return;
      const item = {
        items: [],
        url: `#${node.id}`,
        title: node.innerText
      };

      if (node.nodeName > pNode.nodeName) {
        level = 1;
      } else if (node.nodeName < pNode.nodeName) {
        level = 0;
      }

      if (level === 0) {
        tree.push(item);
      } else if (level === 1) {
        tree[tree.length - 1].items.push(item);
      }

      pNode = node;
    });
    return tree;
  };


  const contentRef = useRef(null);
  const [headers, setHeaders] = useState([])

  // const [heads, ]
  useEffect(()=>{
    // setNum(3)
    const hs =getHeadings(contentRef.current)
    setHeaders(hs)
  }, [])

  function renderTree(pages){
    return pages.map((o)=>{
      return <div key={1}>
        <a href={`/${o.route}`}>{o?.data?.title||o.path}</a>
        {renderTree(o.subPages)}
      </div>
    })
  }

  return (
    <>
    {/* <div>{router.pathname}</div> */}
    
    <div className="flex flex-row w-full">
      <Sidebar/>
      <main className='w-full'>
        <div ref={contentRef}className="px-20">
          <div>{breadcum().map(e => e.route).join(" > ")}</div>
          {props.children}
        </div>
      </main>
      <div className='w-96 relative'>
        <div className='fixed'>

          <Toc heads={headers}/>
        </div>
      </div>
      <button onClick={()=>console.log(contentRef)}>teste ref</button>
    </div>
    </>
  )
}
