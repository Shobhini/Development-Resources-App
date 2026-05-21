const CardSkeleton = () => (
  <div className="border-b-2 bg-gradient-to-r from-[#545454] to-[#807f7f] dark:from-gray-800 dark:to-gray-700 border-b-[#000000] dark:border-gray-600 flex flex-col rounded-lg gap-4 p-4 h-[16rem] w-full animate-pulse">
    <div className="self-center w-40 h-24 bg-gray-500/40 dark:bg-gray-600/40 rounded-sm" />
    <div className="flex flex-col gap-2 items-center">
      <div className="h-4 w-32 bg-gray-500/40 dark:bg-gray-600/40 rounded" />
      <div className="h-3 w-4/5 bg-gray-500/30 dark:bg-gray-600/30 rounded" />
      <div className="h-3 w-3/5 bg-gray-500/30 dark:bg-gray-600/30 rounded" />
    </div>
  </div>
)

export default CardSkeleton
