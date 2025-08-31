import { Link } from 'react-router';
import { Button } from '../../ui/components/Button';

export function NotFound() {
  return (
    <div className="flex justify-center">
      <div className="text-center space-y-6 mt-50">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/">
            <Button size="lg" className="px-8">
              Go Back Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
