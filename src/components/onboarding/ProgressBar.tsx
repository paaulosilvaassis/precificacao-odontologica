interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, label: "Perfil" },
    { number: 2, label: "Custos" },
    { number: 3, label: "Equipe" },
    { number: 4, label: "Metas" },
    { number: 5, label: "Equipamentos" },
  ];

  return (
    <div className="space-y-4">
      {/* Barra de progresso visual */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps com labels */}
      <div className="flex justify-between">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex flex-col items-center gap-2"
          >
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                step.number === currentStep
                  ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white scale-110 shadow-lg"
                  : step.number < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step.number < currentStep ? "✓" : step.number}
            </div>
            <span
              className={`text-xs font-medium hidden sm:block ${
                step.number === currentStep
                  ? "text-purple-600"
                  : step.number < currentStep
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
