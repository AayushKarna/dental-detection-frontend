import { Card, CardHeader, CardTitle } from './ui/card';

function HeadingCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row justify-center items-center space-x-3 space-y-0">
        <CardTitle className="text-2xl">DMF Detection System</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default HeadingCard;
