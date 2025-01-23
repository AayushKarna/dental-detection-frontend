import useResult from './useResult';

const conditions = ['Cavity', 'Fillings', 'Impacted Tooth', 'Implant'];

const conditionColorData = new Map();
conditionColorData
  .set('Cavity', 'red')
  .set('Fillings', 'yellow')
  .set('Impacted Tooth', 'navy')
  .set('Implant', 'purple');

function LabelInfo() {
  const result = useResult();

  const names = result.result?.data.result[0].names || [];
  const boxes = result.result?.data.result[0].boxes || [];

  const conditionTotal = new Map();

  Object.values(names).forEach(name => conditionTotal.set(name, 0));

  boxes.forEach(box => {
    const condition = names[box.class];
    if (condition) {
      conditionTotal.set(condition, (conditionTotal.get(condition) || 0) + 1);
    }
  });

  return (
    <>
      <div
        className={`bg-gray-400 px-3 py-3 bg-opacity-[0.09] mb-3 rounded-md`}
      >
        {conditions.map(condition => (
          <div className="flex items-center gap-4">
            <div
              className={`w-4 h-2`}
              style={{
                backgroundColor: conditionColorData.get(condition)
              }}
            ></div>
            <p>{condition}</p>
          </div>
        ))}
      </div>
      <div className="text-gray-600 text-sm flex flex-col gap-1 mb-4 px-2">
        <p>
          <span className="font-semibold">Cavity: </span>
          {conditionTotal.get('Cavity') || 0}
        </p>
        <p>
          <span className="font-semibold">Fillings: </span>
          {conditionTotal.get('Fillings') || 0}
        </p>
        <p>
          <span className="font-semibold">Impacted Tooth: </span>
          {conditionTotal.get('Impacted Tooth') || 0}
        </p>
        <p>
          <span className="font-semibold">Implant: </span>
          {conditionTotal.get('Implant') || 0}
        </p>
      </div>
    </>
  );
}

export default LabelInfo;
