import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import Image from 'next/image';
import { Track } from 'spotify-web-api-ts/types/types/SpotifyObjects';
import NotFoundImage from "./static/NotFoundImage.png";
import handle from './api/post/[id]';

const Draft: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [published, setPublished] = useState<Boolean>(false);
  const [music, setMusic] = useState<Track>(null);

  const [searchWord, setSearchWord] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);

  useEffect(() => {
    const f = async() =>{
      if(searchWord){
        
        const res = await fetch("./api/spotify/track?"+ new URLSearchParams({
          word: searchWord,
        }))
          .then(async(res) => JSON.parse(await res.text()))
          .catch( () => console.log("search error "));
          
        setSearchResults(res);
      }else{
        setSearchResults([]);
      }
      
    }
    f()
  },[searchWord]);
  
  const selectedmusicJSX = useMemo(() => {
    if(music){
      return <li key={music.id}><Image height={100} width={100} src={music.album.images[0].url} onError={(e) => e.currentTarget.src=NotFoundImage.src} />{music.name}({music.artists[0].name})<div onClick={()=>setMusic(null)}>cancel</div></li>
    }
  },[music]);
  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const album = {id:music.album.id, name:music.album.name}
      const artists = { 
        id: music.artists.map(a => a.id),
        name: music.artists.map(a => a.name),
      }
      const url = music.album.images.length ? music.album.images[0].url  : NotFoundImage.src;
      const spotify_url = music.external_urls.spotify
      const song = {id:music.id, name:music.name, album:album ,artists:artists,image_url: url,spotify_url:spotify_url}
      
      const body = { title, content, published, song };
      await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if(published){
        await Router.push('/');
      }else{
        await Router.push('/posts');
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleMapSearchResult = (r:Track) => {
  
    const src = r.album.images.length ? r.album.images[0].url  : NotFoundImage.src;
      
    return (<li onClick={() => handleSelectMusic(r)} key={r.id}><Image src={src} height={100} width={100} onError={(e) => e.currentTarget.src=NotFoundImage.src} />{r.name}({r.artists[0].name + ": " + r.album.name})</li>);
  
  }
  const handleSelectMusic = (track: Track) => {
    setMusic(track);
  }
  return (
    <Layout>
      <div>
        <form onSubmit={submitData}>
          <h1>New Draft</h1>
          <input 
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content}
          />
          <input
            type="text"
            value={searchWord}
            onChange={(e) => {setSearchWord(e.target.value)}}
            placeholder="search"
          />
          <div className="results">
            <ul>
              {selectedmusicJSX}
            </ul>
            <ul>
              {!selectedmusicJSX && searchResults.map(r => handleMapSearchResult(r))}
            </ul>
          </div>
          <input disabled={!content || !title} type="submit" value="投稿" onClick={()=> setPublished(true)}/>
          <input disabled={!content || !title} type="submit" value="下書き" />
          <a className="back" href="#" onClick={() => Router.back()}>
            or Cancel
          </a>
        </form>
      </div>
      <style jsx>{`
        .page {
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type='text'],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type='submit'] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Draft;