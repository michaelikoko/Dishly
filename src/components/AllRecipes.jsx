'use client'

import { useState } from 'react'
import RecipeCard from './RecipeCard'
import { Spinner, Button, Form, InputGroup } from 'react-bootstrap'
import { getRecipes } from '../actions/recipes'
import Select from 'react-select'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AllRecipes({ recipes, allTags }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get('search') // Get the search query from URL parameters

  const [loadedRecipes, setLoadedRecipes] = useState(recipes.docs) // State to hold loaded recipes
  const [hasNextPage, setHasNextPage] = useState(recipes.hasNextPage) // State to track if there's a next page
  const [nextPage, setNextPage] = useState(recipes.nextPage) // State to track the next page number
  const [loadingMoreRecipes, setLoadingMoreRecipes] = useState(false) // State to track loading status
  const [searchQuery, setSearchQuery] = useState(search|| '') // State to hold search query

  const [applyingFilters, setApplyingFilters] = useState(false) // State to track if filters are being applied
  const [sort, setSort] = useState('') // State to hold selected sort option
  const [tags, setTags] = useState([]) // State to hold selected tags
  const handleChangeSort = (e) => {
    setSort(e ? e.value : '')
  }
  const handleChangeTags = (e) => {
    setTags(e.map((t) => t.value))
  }

  let tagOptions = []
  if (allTags) {
    tagOptions = allTags.map((t) => {
      return {
        label: t.name,
        value: t.slug,
      }
    })
  }

  const sortOptions = [
    { value: 'title_asc', label: 'Alphabetically (A-Z)' },
    { value: 'title_desc', label: 'Aphabetically (Z-A)' },
    { value: 'prep_asc', label: 'Prep Time (Shortest)' },
    { value: 'prep_desc', label: 'Prep Time (Longest)' },
  ]

  async function applyFilters() {
    //console.log('apply filters', sort, tags)
    try {
      setApplyingFilters(true)
      // Fetch recipes based on selected filters
      let queryParams = { page: 1 }
      if (sort) queryParams.sort = sort
      if (tags.length > 0) queryParams.tags = tags
      if (search) queryParams.search = search
      const filteredRecipes = await getRecipes(queryParams)
      if (!filteredRecipes) throw new Error('Failed to apply filters')
      setLoadedRecipes(filteredRecipes.docs)
      setHasNextPage(filteredRecipes.hasNextPage)
      setNextPage(filteredRecipes.nextPage)
    } catch (error) {
      //console.log('Error applying filters', error)
      // Handle error (e.g., show notification)
    } finally {
      setApplyingFilters(false)
    }
  }

  async function loadMoreRecipes() {
    // Function to load more recipes

    try {
      setLoadingMoreRecipes(true) // Set loading state to true
      let queryParams = { page: nextPage }
      if (sort) queryParams.sort = sort
      if (tags.length > 0) queryParams.tags = tags
      if (search) queryParams.search = search

      const moreRecipes = await getRecipes(queryParams) // Fetch more recipes
      if (!moreRecipes) throw new Error('Failed to load more recipes')

      setLoadedRecipes((prevRecipes) => [...prevRecipes, ...moreRecipes.docs]) // Append new recipes to the existing list
      setHasNextPage(moreRecipes.hasNextPage) // Update hasNextPage state
      setNextPage(moreRecipes.nextPage) // Update nextPage state
    } catch (error) {
      // CHANGE TO NOTIFICATION
      //console.error('Error loading recipes', error)
    } finally {
      setLoadingMoreRecipes(false) // Reset loading state
    }
  }
  //console.log(loadedRecipes)
  //console.log(sort)
  //console.log(tags)

  return (
    <>
      <div className="container">
        <div className="row w-100 d-flex flex-row align-items-center justify-content-start justify-content-md-center">
          <div className="col-12 col-md-6 align-self-center">
            <Form
              onSubmit={(e) => {
                e.preventDefault()
                window.location.href = `/recipes?search=${encodeURIComponent(searchQuery)}`
                //router.push(
                //</div>  `/recipes?search=${encodeURIComponent(searchQuery)}`
                //)
                //setSearchQuery('')
              }}
            >
              <InputGroup className="shadow-sm">
                <Form.Control
                  placeholder="Search Recipes"
                  type="text"
                  size="lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="primary" className="text-white" type="submit">
                  <i className="bi bi-search"></i>
                </Button>
              </InputGroup>
            </Form>
          </div>
        </div>

        <div className="container p-0 py-3 bg-white mt-3 shadow-sm rounded">
          <div className="row">
            {search && (
              <div className="fs-4 w-100 px-4 py-2 fw-medium">
                Search results for:{' '}
                <span className="text-primary fw-bold">{search}</span>
              </div>
            )}
            <div className="col-12 col-md-6 d-flex flex-row justify-content-start align-items-center px-4 py-2">
              <div className="w-25 text-muted fs-6 fw-medium">Select Tags:</div>
              <Select
                isMulti
                name="tags"
                options={tagOptions}
                className="basic-multi-select w-75"
                classNamePrefix="select"
                isSearchable={true}
                instanceId="tags-select"
                onChange={handleChangeTags}
                isClearable={true}
              />
            </div>
            <div className="col-12 col-md-6 d-flex flex-row justify-content-start align-items-center px-4 py-2">
              <div className="w-25 text-muted fs-6 fw-medium">Sort by: </div>
              <Select
                options={sortOptions}
                className="w-75"
                onChange={handleChangeSort}
                instanceId="sort-select"
                isClearable={true}
              />
            </div>
          </div>
          <div className="w-100 p-0 d-flex flex-row align-items-center justify-content-start py-3 px-2">
            <div
              className="btn btn-outline-secondary border-0"
              onClick={() => applyFilters()}
            >
              {applyingFilters ? (
                <>
                  <span className="ms-2">Applying Filters...</span>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    variant="secondary"
                  />
                </>
              ) : (
                <span className="ms-2">Apply Filters</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-3 p-0">
          {loadedRecipes.map((recipe, index) => (
            <div className="col-md-3 col-12" key={index}>
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
        {hasNextPage && (
          <div className="d-flex flex-row align-items-center justify-content-center w-100 mt-3">
            <div
              className="btn btn-primary text-white fw-bold px-4 py-2"
              onClick={() => loadMoreRecipes()}
            >
              {loadingMoreRecipes && (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  variant="light"
                />
              )}
              <span className="ms-2">
                {loadingMoreRecipes ? 'Loading Recipes' : 'Load More Recipes'}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
