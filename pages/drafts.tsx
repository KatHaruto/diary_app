import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../components/Layout';
import Post, { PostProps } from '../components/Post';
import { useSession, getSession } from 'next-auth/client';
import prisma from '../lib/prisma';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const _drafts = await prisma.post.findMany({
    where: {
      author: { email: session.user.email },
      published: false,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  const drafts = JSON.parse(JSON.stringify(_drafts));
  drafts.sort((a,b) =>(-1)*(Date.parse(a.createdAt) - Date.parse(b.createdAt)));
  return {
    props: { drafts },
  };
};

type Props = {
  drafts: PostProps[];
};

const Drafts: React.FC<Props> = (props) => {
  const [session] = useSession();

  const [sortKey,setSortKey] = useState(-1);
  const selected = sortKey < 0 ? "latest": "oldest";
  useEffect(()=>{
    console.log(sortKey);
    props.drafts.sort((a,b) =>-sortKey*(Date.parse(a.createdAt) - Date.parse(b.createdAt)));
  },[sortKey]);

  if (!session) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        {sortKey}
      <select name='draftsort'defaultValue={selected} onChange={() => setSortKey(key => (-1)*key)} >
        <option value="latest" >Latest</option>
        <option value="oldest">Oldest</option>
      </select>
        <h1>My Drafts</h1>
        <main>
          {props.drafts.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: var(--geist-background);
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
  );
};

export default Drafts;