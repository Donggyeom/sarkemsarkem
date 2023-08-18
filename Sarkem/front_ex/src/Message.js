import React from 'react'

export default function Message(info) {
    const data = JSON.parse(info.info);
    if (data.type === 'ENTER') data.sender = "공지"
    console.log(JSON.parse(info.info).sender)
  return (
    <div>{data.sender} : {data.message}</div>
  )
}
