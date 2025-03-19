export default function InterviewLayout({ children }) {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="py-4 px-6 bg-background border-b mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Vector Interviews</h1>
          <span className="text-sm text-muted-foreground">Candidate Portal</span>
        </div>
      </div>
      {children}
    </div>
  );
} 