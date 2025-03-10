export function FormError({ message }) {
    if (!message) return null;

    return (
        <p className="text-sm font-medium text-destructive mt-1">{message}</p>
    );
} 