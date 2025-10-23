'use client'

export default function AIOutOfContext({ message }) {
  return (
    <>
      <div className="card w-50 my-3">
        <div className="card-body">{message}</div>
      </div>
    </>
  )
}
