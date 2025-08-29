import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui';

export const Home = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to OffloadIt</CardTitle>
          <CardDescription>
            You are successfully authenticated and can access protected content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This is a protected page that requires authentication.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
