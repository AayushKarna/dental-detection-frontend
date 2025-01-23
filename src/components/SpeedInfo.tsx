import useResult from './useResult';

function SpeedInfo({ className }: { className?: string }) {
  const { result } = useResult();
  console.log(result?.data);

  const speeds = result?.data.result[0].speed;

  return (
    <div className={`${className} `}>
      <h4 className="font-semibold mb-2">Speed</h4>
      {!speeds ? (
        <p className="text-sm px-2 text-gray-600">No speed data available</p>
      ) : (
        <ul className="flex flex-col gap-1 text-sm text-gray-600 px-2">
          {Object.entries(speeds).map(([name, time]) => (
            <li key={name}>
              <span className="font-semibold">
                {name[0].toUpperCase() + name.slice(1)}
              </span>
              : {time.toFixed(2) + ' ms'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SpeedInfo;
