'use client'
import Image from 'next/image'
import { Button } from 'react-bootstrap'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <div className="container">
      <div className="row py-4">
        <div className="col-md-6 col-12 d-flex flex-column align-items-start justify-content-center py-3">
          <div className="fs-1 fw-bold">
            <span className='text-dark'>Cook. </span>
            <span className='text-secondary'>Share. </span>
            <span className="text-primary">Inspire</span>
          </div>
          <div className="lead fs-5 mt-3">
            Discover amazing recipes from home cooks around the world. Share
            your culinary creations and inspire others to cook with love.
          </div>
          <Link href="/my-recipes">
            <Button
              variant="primary"
              className="rounded-pill fw-bold text-white mt-3 px-4 py-2"
            >
              Create Recipes
            </Button>
          </Link>
        </div>
        <div className="col-md-6 col-12 d-flex align-items-center justify-content-center py-3">
          <Image
            src="/hero-image.jpg"
            alt="Picture of pasta dish"
            width={600}
            height={600}
            className="img-fluid rounded shadow-lg border border-top-0 border-start-0 border-primary border-5 border-opacity-25"
          />
        </div>
      </div>
    </div>
  )
}
