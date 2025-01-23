import useResult from './useResult';

function ShapeInfo({ className }: { className?: string }) {
  const { result } = useResult();
  console.log(result?.data?.result[0].orig_shape);

  const shape = result?.data?.result[0].orig_shape;

  return (
    <div className={`${className} `}>
      <h4 className="font-semibold mb-2">
        Shape:{' '}
        <span className="font-normal text-gray-600">
          {shape ? `${shape[0]}px x ${shape[1]}px` : 'N/A'}
        </span>
      </h4>
    </div>
  );
}

export default ShapeInfo;
