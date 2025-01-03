import React from 'react';

import Tag from '../../components/Tag/tag.jsx';

// Profile card for users in friends page
function ProfileCard(props) {
    return (
      <a href={`/mainprofile/${props.userID}/`} className="rounded-3xl overflow-hidden border-1 border-slate-300 hover:border-slate-400 bg-white shadow-md hover:shadow-lg focus:shadow-md active:shadow-md w-full relative hover:scale-[1.02] transition-all focus:scale-[0.98] active:scale[0.98]">
        <div className="w-full">
          <div className="absolute right-0 top-0 flex gap-2 bg-[#00000044] p-2 rounded-bl-2xl">
            <Tag text={props.compatability + "%"} color="blue" />
            {props.leader === true ? <Tag text="Leader" color="yellow" /> : null}
          </div>
        </div>
        <div className="w-full h-32 outline-none" style={{backgroundColor: `#${props.bannerColor}`}} href={props.profilePicture}></div>
        <div className="px-3 py-3">
          <div className="flex items-center justify-between gap-10">
            <p className="font-bold text-xl text-zinc-800">{props.name}</p>
            <Tag text={props.connections + " connections"} />
          </div>
          <p className="text-zinc-500">
            {props.major} '{props.graduationYear}
          </p>
          <p className="text-zinc-500 font-medium my-3">{props.classes.join(", ")}</p>
          <div className="flex gap-2">
            {props.interests.map((element, key) => {
              return <Tag text={element} key={key} />;
            })}
          </div>
        </div>
      </a>
    );
}

export default ProfileCard;