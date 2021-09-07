import type { GetStaticProps, NextPage } from 'next'
import prisma from '../lib/prisma';
import Post, { PostProps } from '../components/Post';
import React, { useEffect, useState } from 'react';
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
  const [sortKey,setSortKey] = useState(1);
  const selected = sortKey > 0 ? "Latest": "Oldest";
  useEffect(()=>{
    props.feed.sort((a,b) =>sortKey*(Date.parse(a.createdAt) - Date.parse(b.createdAt)));
  },[sortKey]);
  
  return (
    <Layout>
      <div className="page">
      <select name='postsort'defaultValue={selected} onChange={() => setSortKey(key => (-1)*key)} >
        <option value="Latest" >Latest</option>
        <option value="Oldest">Oldest</option>
      </select>
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
