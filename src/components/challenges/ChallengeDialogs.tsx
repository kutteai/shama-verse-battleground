
import type { AdminChallenge } from "@/lib/challengesAdminApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Re-export for any remaining callers that imported Challenge from here
export type { AdminChallenge as Challenge };

interface ChallengeDialogsProps {
  isPauseDialogOpen: boolean;
  setPauseDialogOpen: (open: boolean) => void;
  isBanDialogOpen: boolean;
  setBanDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  selectedChallenge: AdminChallenge | null;
  onPauseChallenge: () => void;
  onBanChallenge: () => void;
  onDeleteChallenge: () => void;
  isPending?: boolean;
}

const ChallengeDialogs = ({
  isPauseDialogOpen,
  setPauseDialogOpen,
  isBanDialogOpen,
  setBanDialogOpen,
  isDeleteDialogOpen,
  setDeleteDialogOpen,
  selectedChallenge,
  onPauseChallenge,
  onBanChallenge,
  onDeleteChallenge,
  isPending,
}: ChallengeDialogsProps) => {
  return (
    <>
      {/* Pause Challenge Dialog */}
      <AlertDialog open={isPauseDialogOpen} onOpenChange={setPauseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Pause Challenge</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to pause this challenge?
              {selectedChallenge && (
                <span className="font-medium block mt-2">"{selectedChallenge.title}"</span>
              )}
              This will flag it as paused by admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onPauseChallenge}
              className="bg-yellow-500 hover:bg-yellow-600"
              disabled={isPending}
            >
              {isPending ? "Pausing…" : "Pause Challenge"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Ban Challenge Dialog */}
      <AlertDialog open={isBanDialogOpen} onOpenChange={setBanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ban Challenge</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to ban this challenge?
              {selectedChallenge && (
                <span className="font-medium block mt-2">"{selectedChallenge.title}"</span>
              )}
              This will hide it from public view.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onBanChallenge}
              className="bg-red-500 hover:bg-red-600"
              disabled={isPending}
            >
              {isPending ? "Banning…" : "Ban Challenge"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Challenge Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Challenge</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this challenge?
              {selectedChallenge && (
                <span className="font-medium block mt-2">"{selectedChallenge.title}"</span>
              )}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteChallenge}
              className="bg-red-700 hover:bg-red-800"
              disabled={isPending}
            >
              {isPending ? "Deleting…" : "Delete Challenge"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChallengeDialogs;
