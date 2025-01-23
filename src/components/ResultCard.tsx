import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Rect,
  Text,
  Line
} from 'react-konva';
import useResult from './useResult';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Box } from '@/types';
import type Konva from 'konva';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';

function ResultCard({ className }: { className?: string }) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('All');
  const [isPanZoomEnabled, setIsPanZoomEnabled] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [lines, setLines] = useState([]);

  const stageParentRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  });

  const [isShiftRightClickDrawEnabled, setIsShiftRightClickDrawEnabled] =
    useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (
      stageParentRef.current?.offsetHeight &&
      stageParentRef.current?.offsetWidth
    ) {
      setDimensions({
        width: stageParentRef.current.offsetWidth,
        height: stageParentRef.current.offsetHeight
      });
    }
  }, []);

  const imageRef = useRef<Konva.Image | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);

  const { result } = useResult();

  let boxes: Box[] = [],
    names: { [key: number]: string } = {};

  if (result?.data?.result?.[0]) {
    ({ boxes, names } = result.data.result[0]);
  }

  const handleMouseDown = e => {
    const stage = e.target.getStage();
    const scale = stage.scaleX(); // Assuming uniform scaling (scaleX = scaleY)
    const position = stage.position(); // Stage's position

    // Get the raw pointer position
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // Adjust for scale and position
    const adjustedPos = {
      x: (pointer.x - position.x) / scale,
      y: (pointer.y - position.y) / scale
    };

    setIsDrawing(true);
    setLines([...lines, { points: [adjustedPos.x, adjustedPos.y] }]);
  };

  const handleMouseMove = e => {
    if (!isShiftRightClickDrawEnabled || !e.evt.shiftKey) {
      return;
    }

    if (!isDrawing) return;

    const stage = e.target.getStage();
    const scale = stage.scaleX(); // Assuming uniform scaling (scaleX = scaleY)
    const position = stage.position(); // Stage's position

    // Get the pointer position relative to the stage
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // Adjust for scale and position
    const adjustedPoint = {
      x: (pointer.x - position.x) / scale,
      y: (pointer.y - position.y) / scale
    };

    // Update the last line with adjusted points
    const updatedLine = {
      ...lines[lines.length - 1],
      points: [
        ...lines[lines.length - 1].points,
        adjustedPoint.x,
        adjustedPoint.y
      ]
    };

    // Create a new copy of the lines array with the updated line
    const updatedLines = [...lines.slice(0, lines.length - 1), updatedLine];
    setLines(updatedLines);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    setLines([]);
  };

  useEffect(() => {
    if (result?.data?.image) {
      const img = new Image();
      img.src = `http://127.0.0.1:5000${result.data.image}`;
      img.onload = () => {
        setImage(img);
      };

      const [origWidth, origHeight] = result.data.result[0]?.orig_shape || [
        1, 1
      ];

      const scaleX = dimensions.width / origWidth;
      const scaleY = dimensions.height / origHeight;

      const scaleFactor = Math.min(scaleX, scaleY);
      setScale(scaleFactor);
    }
  }, [result, dimensions]);

  const getColor = (className: number): string => {
    switch (names[className]) {
      case 'Cavity':
        return 'red';
      case 'Fillings':
        return 'yellow';
      case 'Impacted Tooth':
        return 'navy';
      case 'Implant':
        return 'purple';
      default:
        return 'blue';
    }
  };

  const filteredBoxes =
    selectedTab === 'All'
      ? boxes
      : boxes.filter(box => names[box.class] === selectedTab);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    if (!stage) return;

    const scaleBy = 1.1;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    if (!pointer) return;

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    const limitedScale = Math.max(0.5, Math.min(newScale, 5));

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * limitedScale,
      y: pointer.y - mousePointTo.y * limitedScale
    };

    setScale(limitedScale);
    setPosition(newPos);
    stage.scale({ x: limitedScale, y: limitedScale });
    stage.position(newPos);
  };

  const imageWidth = image?.width ?? 0;
  const imageHeigth = image?.height ?? 0;

  const imageX = (dimensions.width - imageWidth * scale) / 2;
  const imageY = (dimensions.height - imageHeigth * scale) / 2;

  return (
    <Card className={`${className} h-full flex flex-col`}>
      <CardHeader>
        <CardTitle>Result</CardTitle>
      </CardHeader>
      <CardContent className="h-full transition-opacity duration-300 ease-in-out opacity-100 overflow-scroll">
        <Tabs
          defaultValue="All"
          className="flex flex-col h-full w-full"
          onValueChange={value => setSelectedTab(value)}
        >
          <TabsList className="mb-5">
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Cavity">Cavity</TabsTrigger>
            <TabsTrigger value="Fillings">Fillings</TabsTrigger>
            <TabsTrigger value="Impacted Tooth">Impacted Tooth</TabsTrigger>
            <TabsTrigger value="Implant">Implant</TabsTrigger>
            <TabsTrigger value="RAW">RAW</TabsTrigger>
          </TabsList>

          <div className="flex gap-3 items-center mb-4">
            <Checkbox
              id="enablePanZoom"
              checked={isPanZoomEnabled}
              onCheckedChange={() => setIsPanZoomEnabled(!isPanZoomEnabled)}
            />
            <label
              htmlFor="enablePanZoom"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:cursor-pointer"
            >
              Enable Pan Zoom
            </label>
          </div>

          <div className="flex gap-3 items-center mb-4">
            <Checkbox
              id="enableShiftRightClickDraw"
              checked={isShiftRightClickDrawEnabled}
              onCheckedChange={() =>
                setIsShiftRightClickDrawEnabled(!isShiftRightClickDrawEnabled)
              }
            />
            <label
              htmlFor="enableShiftRightClickDraw"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:cursor-pointer"
            >
              Enable <Badge variant="secondary">Shift</Badge> +{' '}
              <Badge variant="secondary">Left Key</Badge> draw
            </label>
          </div>

          <Button
            className="self-start"
            variant="outline"
            onClick={handleClear}
          >
            Clear Canvas
          </Button>

          <TabsContent
            value={selectedTab}
            ref={stageParentRef}
            className="w-full h-full"
          >
            <Stage
              width={dimensions['width']}
              height={dimensions['height']}
              scale={{ x: scale, y: scale }}
              position={position}
              draggable={isPanZoomEnabled}
              ref={stageRef}
              onWheel={isPanZoomEnabled ? handleWheel : undefined}
              className="border-solid border-2 border-gray-100 rounded-s w-full h-full"
              onMouseDown={handleMouseDown}
              onMousemove={handleMouseMove}
              onMouseup={handleMouseUp}
            >
              <Layer>
                {image && (
                  <KonvaImage
                    image={image}
                    ref={imageRef}
                    x={imageX}
                    y={imageY}
                    width={image.width * scale}
                    height={image.height * scale}
                  />
                )}

                {filteredBoxes.map((box, index) => {
                  const boxScale = scale;

                  const offsetX = image
                    ? (dimensions.width - image.width * scale) / 2
                    : 0;
                  const offsetY = image
                    ? (dimensions.height - image.height * scale) / 2
                    : 0;

                  const x = offsetX + (box.x - box.w / 2) * boxScale;
                  const y = offsetY + (box.y - box.h / 2) * boxScale;

                  const width = box.w * boxScale;
                  const height = box.h * boxScale;

                  const color = getColor(box.class);

                  return (
                    <React.Fragment key={index}>
                      <Rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        stroke={color}
                        strokeWidth={2 / scale}
                      />
                      <Text
                        x={x + 5}
                        y={y - 20}
                        text={`${names[box.class]} (${(
                          box.confidence * 100
                        ).toFixed(1)}%)`}
                        fontSize={12 / scale}
                        fill={color}
                      />
                    </React.Fragment>
                  );
                })}

                {lines.map((line, i) => (
                  <Line
                    key={i}
                    points={line.points}
                    stroke="#df4b26"
                    strokeWidth={5}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    globalCompositeOperation={'source-over'}
                  />
                ))}
              </Layer>
            </Stage>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default ResultCard;
