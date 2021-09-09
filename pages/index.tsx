import type { GetStaticProps, NextPage } from 'next'
import prisma from '../lib/prisma';
import Post, { PostProps } from '../components/Post';
import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';


export const getStaticProps: GetStaticProps = async () => {
  const _feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  const feed = JSON.parse(JSON.stringify(_feed));
  feed.sort((a,b) =>-(Date.parse(a.createdAt) - Date.parse(b.createdAt)));
  return { props: { feed } };
};

type Props = {
  feed: PostProps[]
}


const Blog: React.FC<Props> = (props) => {
  
  
  const [sort,setSort] = useState({key:"",order:0,});

  useMemo(() => {
    let tmp_feed = props.feed;
    if(sort.key){
      tmp_feed = tmp_feed.sort((a,b) =>{
        a = Date.parse(a[sort.key]);
        b = Date.parse(b[sort.key]);
        return (a === b ? 0 : a > b ? 1 : -1) * sort.order;
      });
    }
    return tmp_feed;
  },[sort]);
  
  const handlesort = column => {
    if (sort.key === column){
      setSort({ ...sort, order: -sort.order });
    } else {
        setSort({
            key: column,
            order: 1
        })
    }
  };
  
  return (
    <Layout>
      <div className="page">
      <table>
            <thead>
            <tr>
                <th onClick={() => handlesort("createdAt")}>
                  Created{sort.order > 0 ? " ▲":" ▼"}</th>
                <th>タイトル</th>
            </tr>
            </thead>
      </table>
        <h1>Public Feed</h1>
        <main>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default Blog
