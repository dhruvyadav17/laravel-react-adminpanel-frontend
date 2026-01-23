import { stopImpersonation } from "../../utils/impersonation";
import { useAuth } from "../../auth/hooks/useAuth";

export default function ExitImpersonationButton() {
  const { isImpersonating } = useAuth();

  if (!isImpersonating) return null;

  return (
    <button
      onClick={stopImpersonation}
      className="btn btn-danger btn-sm ms-2"
    >
      Exit Impersonation
    </button>
  );
}
