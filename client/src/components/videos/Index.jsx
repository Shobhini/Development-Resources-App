import Card from '../Card'
import Filter from '../filter/Index'
import CardSkeleton from '../CardSkeleton'
import useResources from '../../hooks/useResources'

const Index = () => {
  const { data, loading, error, page, pages, setPage, handleFilterChange } = useResources('videos')

  return (
    <div className="m-8 mt-32 lg:mt-8">
      <Filter onStateChange={handleFilterChange} />
      {error && <p className="text-red-500">Error: {error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
          : data.length > 0
            ? data.map((res, i) => (
                <Card key={res._id} _id={res._id} title={res.title} link={res.link}
                  description={res.description} i={i} img={res.img} />
              ))
            : <p className="text-gray-500 dark:text-gray-400 col-span-full">No resources found.</p>
        }
      </div>
      {!loading && pages > 1 && (
        <div className="flex gap-3 mt-8 items-center">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 bg-[#545454] text-white rounded-lg disabled:opacity-40">Prev</button>
          <span className="text-gray-600 dark:text-gray-300">Page {page} of {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
            className="px-4 py-2 bg-[#545454] text-white rounded-lg disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  )
}

export default Index
