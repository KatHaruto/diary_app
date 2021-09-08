import React, { useEffect, useMemo, useState } from 'react';
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
  drafts.sort((a,b) => -1 * (Date.parse(a.createdAt) - Date.parse(b.createdAt)));
  return {
    props: { drafts },
  };
};

type Props = {
  drafts: PostProps[];
};

const Drafts: React.FC<Props> = (props) => {
  const [session] = useSession();

  const [sort,setSort] = useState({});
  
  useMemo(() => {
    let tmp_drafts = props.drafts;
    if(sort.key){
      tmp_drafts = tmp_drafts.sort((a,b) =>{
        a = Date.parse(a[sort.key]);
        b = Date.parse(b[sort.key]);
        return (a === b ? 0 : a > b ? 1 : -1) * sort.order;
      });
    }
    return tmp_drafts;
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
      <table>
            <thead>
            <tr>
                <th onClick={() => handlesort("createdAt")}>
                  Created{sort.order > 0 ? " ▲":" ▼"}</th>
                <th>タイトル</th>
            </tr>
            </thead>
      </table>
      

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