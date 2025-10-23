import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="pt-5 bg-dark d-flex flex-column align-items-center justify-content-center">
      <div className="d-flex flex-row align-items-center justify-content-center px-5">
        <Link href="/">
          <div className="btn btn-outline-secondary border-0 rounded-circle">
            <i className="bi bi-twitter-x text-white"></i>
          </div>
        </Link>
        <Link href="/">
          <div className="btn btn-outline-secondary border-0 rounded-circle">
            <i className="bi bi-envelope-at-fill text-white"></i>
          </div>
        </Link>
        <Link href="/">
          <div className="btn btn-outline-secondary border-0 rounded-circle">
            <i className="bi bi-linkedin text-white"></i>
          </div>
        </Link>
        <Link href="/">
          <div className="btn btn-outline-secondary border-0 rounded-circle">
            <i className="bi bi-bluesky text-white"></i>
          </div>
        </Link>
      </div>
      <div className="d-flex flex-row align-items-center justify-content-center px-5">
        <Link
          href="/"
          className="link-offset-2 link-offset-3-hover link-underline-primary text-white link-underline-opacity-0 link-underline-opacity-75-hover py-2 px-2"
        >
          <span>Home</span>
        </Link>
        <Link
          href="/"
          className="link-offset-2 link-offset-3-hover link-underline-primary text-white link-underline-opacity-0 link-underline-opacity-75-hover py-2 px-2"
        >
          <span>All Recipes</span>
        </Link>
        <Link
          href="/"
          className="link-offset-2 link-offset-3-hover link-underline-primary text-white link-underline-opacity-0 link-underline-opacity-75-hover py-2 px-2"
        >
          <span>contact Us</span>
        </Link>

      </div>
      <div className='text-white mt-3 p-1 w-100 text-center'>
        &copy; 2025, Created by <a href="https://michaelikoko.github.io" target="_blank" rel="noopener noreferrer" className='text-secondary text-decoration-none'>Michael Ikoko</a>
      </div>
    </footer>
  )
}
