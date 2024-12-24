'use strict';

const exampleData = {
  data: {
    image:
      '/uploads/ef770669e173348941b13925e14b955e843548327ee7f03340332ae42c7976a4.jpg',
    message: 'Image uplaod successful',
    result: [
      {
        boxes: [
          {
            class: 1,
            confidence: 0.8934866189956665,
            h: 109.99447631835938,
            w: 48.062713623046875,
            x: 463.9688720703125,
            y: 235.1671600341797
          },
          {
            class: 1,
            confidence: 0.8780584931373596,
            h: 116.43119812011719,
            w: 43.878570556640625,
            x: 227.7652587890625,
            y: 211.82647705078125
          },
          {
            class: 1,
            confidence: 0.8676173090934753,
            h: 111.38764953613281,
            w: 25.041015625,
            x: 408.76708984375,
            y: 216.97506713867188
          },
          {
            class: 1,
            confidence: 0.8138566613197327,
            h: 58.96534729003906,
            w: 18.6484375,
            x: 431.1293029785156,
            y: 248.07492065429688
          },
          {
            class: 1,
            confidence: 0.7398761510848999,
            h: 108.4127197265625,
            w: 26.45684814453125,
            x: 496.62646484375,
            y: 395.2304992675781
          },
          {
            class: 2,
            confidence: 0.7330716848373413,
            h: 91.88432312011719,
            w: 70.626953125,
            x: 169.1295166015625,
            y: 231.72274780273438
          }
        ],
        names: {
          0: 'Cavity',
          1: 'Fillings',
          2: 'Impacted Tooth',
          3: 'Implant'
        },
        orig_shape: [640, 640],
        path: 'D:\\yolo_started\\uploads\\ef770669e173348941b13925e14b955e843548327ee7f03340332ae42c7976a4.jpg',
        speed: {
          inference: 6.000280380249023,
          postprocess: 91.72439575195312,
          preprocess: 4.977941513061523
        }
      }
    ]
  },
  status: 'success'
};

const canvas = document.getElementById('yoloCanvas');
const ctx = canvas.getContext('2d');

const image = new Image();
image.src = `http://127.0.0.1:5000${exampleData.data.image}`;

image.addEventListener('load', function () {
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  ctx.drawImage(image, 0, 0);

  const { boxes, names } = exampleData.data.result[0];

  console.log(boxes);

  boxes.forEach(box => {
    const x = box.x - box.w / 2;
    const y = box.y - box.h / 2;

    let color;
    if (names[box.class] === 'Cavity') {
      color = 'red';
    } else if (names[box.class] === 'Fillings') {
      color = 'yellow';
    } else if (names[box.class] === 'Impacted Tooth') {
      color = 'green';
    } else if (names[box.class] === 'Implant') {
      color = 'purple';
    }

    ctx.beginPath();
    ctx.rect(x, y, box.w, box.h);
    ctx.lineWidth = 4;
    ctx.strokeStyle = color;
    ctx.stroke();

    const label = `${names[box.class]} (${(box.confidence * 100).toFixed(1)}%)`;
    ctx.fillStyle = color;
    ctx.font = '12px Arial';
    ctx.fillText(label, x + 5, y - 5);
  });
});
