export function ErrorState({ message, detail, onRetry }: { message: string, detail?: string, onRetry?: () => void }) {
  return (
    <div className="card p-4">
      <div className="text-red-700 font-semibold mb-1">{message}</div>
      {detail ? <div className="text-xs text-red-600 mb-2" dir="ltr">{detail}</div> : null}
      {onRetry ? <button className="btn-primary" onClick={onRetry}>تلاش مجدد</button> : null}
    </div>
  );
}
