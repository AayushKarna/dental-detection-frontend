import LabelInfo from './LabelInfo';
import ShapeInfo from './ShapeInfo';
import SpeedInfo from './SpeedInfo';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

function Sidebar({ className }: { className?: string }) {
  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle>Labelling Info</CardTitle>
      </CardHeader>
      <CardContent>
        <LabelInfo />
        <SpeedInfo className="mb-4" />
        <ShapeInfo />
      </CardContent>
    </Card>
  );
}

export default Sidebar;
