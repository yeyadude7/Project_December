import React, { useState, useEffect } from 'react';
import Config from '../../config.js';
import Tag from '../../components/Tag/tag.jsx';

// Profile card for users in friends page
function ProfileCard(props) {
  const [interests, setInterests] = useState(null);
  const [connectionsCount, setConnectionsCount] = useState(0);

  useEffect(() => {
    const fetchInterests = async () => {
      if (props.userID === undefined) return;

      const request = await fetch(`${window.location.protocol}//${window.location.hostname}:${Config.SERVER_PORT}/api/interest/${props.userID}`);
      const response = await request.json();

      if (request.status === 200)
        setInterests(response);
    };

    fetchInterests();

    const fetchConnections = async () => {
      if (props.userID === undefined) return;

      const request = await fetch(`${window.location.protocol}//${window.location.hostname}:${Config.SERVER_PORT}/api/friend/?user_id=${props.userID}`);
      const response = await request.json();

      if (request.status === 200)
        setConnectionsCount(response.length);
    };

    fetchConnections();
  }, [props.userID]);
  

  return (
    (!props.userID || !interests) ? 
    <div className="rounded-3xl h-[298px] overflow-hidden border-1 border-slate-300 bg-white shadow-md w-full relative transition-all">
      <div className="w-full h-44 overflow-hidden outline-none bg-zinc-100 animate-pulse" />
      <div className="px-3 py-3">
        <div className="text-zinc-800 h-[28px] w-[163px] bg-zinc-100 animate-pulse" />
        <div className="flex gap-2 my-3 h-[24px] w-[250px] bg-zinc-100 animate-pulse" />
        <div className="flex gap-2 my-3">
          <Tag placeholder={true} />
          <Tag placeholder={true} />
          <Tag placeholder={true} />
        </div>
      </div>
    </div> :
    <a href={`/mainprofile/${props.userID}/`} className="rounded-3xl overflow-hidden border-1 border-slate-300 hover:border-slate-400 bg-white shadow-md hover:shadow-lg focus:shadow-md active:shadow-md w-full relative hover:scale-[1.02] transition-all focus:scale-[0.98] active:scale[0.98]">
      {/* <div className="w-full">
        <div className="absolute right-0 top-0 flex gap-2 bg-[#00000044] p-2 rounded-bl-2xl">
          <Tag text={props.compatability + "%"} color="blue" />
          {props.leader === true ? <Tag text="Leader" color="yellow" /> : null}
        </div>
      </div> */}
      <div className="w-full h-44 overflow-hidden outline-none">
        <img src={props.bannerImage} alt="Banner" className="w-full h-full object-cover" />
      </div>
      <div className="px-3 py-3">
        <div className="flex items-center justify-between gap-10">
          <p className="font-bold text-xl text-zinc-800">{props.name}</p>
          <Tag text={connectionsCount + " connections"} />
        </div>
        <p className="text-zinc-800">
          {props.major} | <span className="text-zinc-500">{props.year}</span>
        </p>
        {/* <p className="text-zinc-500 font-medium my-3">{props.classes.join(", ")}</p> */}
        <div className="flex gap-2 my-3">
          {interests === null ? null : interests.map((element, key) => {
            return <Tag text={element.name} key={key} />;
          })}
        </div>
      </div>
    </a>
  );
}

export default ProfileCard;