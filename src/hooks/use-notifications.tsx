import { useToast } from "@/components/ui/use-toast";

type Errors = Record<string, string>;
type Paragraphs = string | string[] | Errors;

export const useNotifications = () => {
    const { toast } = useToast();

    const getRandomKey = () => Math.floor(Math.random() * 100).toString();

    const parseParagraphs = (paragraphs: Paragraphs) => {
        let entries: [string, string][] = [];

        if (typeof paragraphs === 'string') {
            entries = [[getRandomKey(), paragraphs]];
        } else if (Array.isArray(paragraphs)) {
            entries = paragraphs.map((paragraph) => [getRandomKey(), paragraph]);
        } else if (typeof entries === 'object') {
            entries = Object.entries(paragraphs);
        }

        return entries.map(([key, error]) => (<p key={key}>{error}</p>));
    }

    const notifyError = (paragraphs: Paragraphs) => {
        toast({
            variant: 'destructive',
            description: parseParagraphs(paragraphs),
        });
    }

    const notifySuccess = (paragraphs: Paragraphs) => {
        toast({
            variant: 'success',
            description: parseParagraphs(paragraphs),
        });
    }

    return {
        notifyError,
        notifySuccess,
    };
}
