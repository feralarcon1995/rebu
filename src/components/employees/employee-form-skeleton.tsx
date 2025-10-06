import { Card, CardContent, CardHeader } from '../ui/card';

const EmployeeFormSkeleton = () => {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="bg-primary/5 dark:bg-primary/10 absolute top-0 right-0 h-96 w-96 rounded-full blur-3xl"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%)' }}
        />
        <div
          className="bg-primary/5 dark:bg-primary/10 absolute bottom-0 left-0 h-96 w-96 rounded-full blur-3xl"
          style={{
            clipPath: 'polygon(50% 20%, 100% 0, 100% 100%, 0 100%, 0 0)',
          }}
        />
      </div>

      <div className="space-y-6">
        <Card className="border-border relative overflow-hidden shadow-sm">
          <div
            className="from-primary/10 via-primary/5 absolute top-0 right-0 h-full w-64 bg-gradient-to-l to-transparent"
            style={{ clipPath: 'polygon(100% 0, 100% 100%, 40% 100%)' }}
          />
          <CardContent className="relative p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-9 w-32 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />

                  <div className="space-y-2">
                    <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border relative overflow-hidden">
          <div className="from-primary to-primary/60 absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r" />
          <CardHeader>
            <div className="h-7 w-56 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="h-5 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="h-5 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-14 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="h-5 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-14 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="h-5 w-18 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="h-5 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-5 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
            </div>

            <div className="space-y-2">
              <div className="h-5 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-24 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
            </div>

            <div className="flex justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-600">
              <div className="h-10 w-20 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
              <div className="h-10 w-32 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default EmployeeFormSkeleton;
