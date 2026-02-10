import { Button } from "@/components/ui/button"
import { CheckoutStep, CheckoutStepKey } from "@/lib/types/global"
import { clsx } from "clsx"

type CheckoutProgressProps = {
  steps: CheckoutStep[];
  currentStepIndex: number;
  handleStepChange: (step: CheckoutStepKey) => void;
  className?: string;
};

const CheckoutProgress = ({
  steps,
  currentStepIndex,
  handleStepChange,
  className,
}: CheckoutProgressProps) => {
  return (
    <div className={clsx("flex flex-wrap gap-4 items-center", className)}>
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center gap-4">
          <Button
            onClick={() => handleStepChange(step.key)}
            variant={"transparent"}
            className={clsx(
              "p-0 hover:bg-transparent",
              index !== currentStepIndex &&
                "text-ds-muted-foreground hover:text-ds-muted-foreground",
              index === currentStepIndex &&
                "text-ds-foreground hover:text-ds-muted-foreground"
            )}
            disabled={index > currentStepIndex}
          >
            {step.title}
          </Button>
          {index < steps.length - 1 && (
            <div className="w-8 h-px bg-ds-muted" />
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutProgress;
